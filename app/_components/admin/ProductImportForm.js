"use client";

import { useState } from "react";
import Papa from "papaparse";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import { bulkImportProducts } from "@/app/_lib/actions";
import { DocumentArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductImportForm() {
  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState("");

  function handleImageSelect(e) {
    setImageFiles(Array.from(e.target.files));
  }

  async function handleImport() {
    if (!csvFile) {
      toast.error("Please select a CSV file.");
      return;
    }

    setParsing(true);
    setResults(null);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        try {
          const rows = parsed.data;
          const resolvedRows = [];

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            setProgress(
              `Processing row ${i + 1} of ${rows.length}: ${row.name || "unnamed"}`,
            );

            const filenames = row.images
              ? row.images
                  .split("|")
                  .map((f) => f.trim())
                  .filter(Boolean)
              : [];

            const imageUrls = [];

            for (const filename of filenames) {
              const matchedFile = imageFiles.find((f) => f.name === filename);

              if (!matchedFile) {
                // Missing image is not fatal here — the server action
                // will still create the product, just without this image.
                // We track it so we can warn the user in results.
                imageUrls.push(null);
                continue;
              }

              const fileExt = matchedFile.name.split(".").pop();
              const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
              const filePath = `${process.env.NEXT_PUBLIC_TENANT_ID}/products/bulk-import/${uniqueName}`;

              const { error: uploadError } = await supabaseAuth.storage
                .from("images")
                .upload(filePath, matchedFile);

              if (uploadError) {
                imageUrls.push(null);
                continue;
              }

              const { data } = supabaseAuth.storage
                .from("images")
                .getPublicUrl(filePath);
              imageUrls.push(data.publicUrl);
            }

            resolvedRows.push({
              ...row,
              imageUrls: imageUrls.filter(Boolean),
              missingImages:
                filenames.length - imageUrls.filter(Boolean).length,
            });
          }

          setProgress("Saving products...");
          const importResults = await bulkImportProducts(resolvedRows);

          // Merge in missing-image warnings for successful rows
          const merged = importResults.map((r, i) => ({
            ...r,
            missingImages: resolvedRows[i]?.missingImages || 0,
          }));

          setResults(merged);

          const successCount = merged.filter((r) => r.success).length;
          toast.success(
            `Imported ${successCount} of ${merged.length} products`,
          );
        } catch (err) {
          toast.error("Import failed: " + err.message);
        } finally {
          setParsing(false);
          setProgress("");
        }
      },
      error: (err) => {
        toast.error("Failed to parse CSV: " + err.message);
        setParsing(false);
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
        <h2 className="font-bold text-heading">1. Upload CSV File</h2>
        <label className="cursor-pointer border-2 border-dashed border-gray-medium hover:border-primary transition-colors rounded-lg p-6 flex flex-col items-center gap-2">
          <DocumentArrowUpIcon className="w-8 h-8 text-text-light" />
          <span className="text-sm text-text-light">
            {csvFile ? csvFile.name : "Click to select CSV file"}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
        <h2 className="font-bold text-heading">2. Upload Product Images</h2>
        <p className="text-xs text-text-light">
          Select all image files referenced in your CSV&apos;s{" "}
          <code className="bg-gray-light px-1 rounded">images</code> column at
          once. Filenames must match exactly.
        </p>
        <p className="text-xs text-text-light">
          Leave the <code className="bg-gray-light px-1 rounded">images</code>
          column blank for any product you&apos;d rather add images to
          individually later — the product will still be created, just without
          photos until you edit it.
        </p>
        <label className="cursor-pointer border-2 border-dashed border-gray-medium hover:border-primary transition-colors rounded-lg p-6 flex flex-col items-center gap-2">
          <PhotoIcon className="w-8 h-8 text-text-light" />
          <span className="text-sm text-text-light">
            {imageFiles.length > 0
              ? `${imageFiles.length} image(s) selected`
              : "Click to select image files"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={handleImport}
        disabled={parsing || !csvFile}
        className="cursor-pointer w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {parsing ? progress || "Importing..." : "Start Import"}
      </button>

      {results && (
        <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="font-bold text-heading">Import Results</h2>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {results.map((r) => (
              <div
                key={r.row}
                className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                  r.success
                    ? "bg-green-50 dark:bg-green-950/30"
                    : "bg-red-50 dark:bg-red-950/30"
                }`}
              >
                <span
                  className={`font-bold shrink-0 ${
                    r.success ? "text-success" : "text-sale"
                  }`}
                >
                  {r.success ? "✓" : "✗"}
                </span>
                <div>
                  <p className="text-text font-medium">
                    Row {r.row}: {r.name}
                  </p>
                  {r.success && r.missingImages > 0 && (
                    <p className="text-yellow-600 text-xs mt-0.5">
                      Created, but {r.missingImages} image(s) were not found in
                      the selected files.
                    </p>
                  )}
                  {!r.success && (
                    <p className="text-sale text-xs mt-0.5">{r.error}</p>
                  )}
                </div>
              </div>
            ))}
            <Link
              href="/admin/products"
              className="text-primary text-sm hover:underline mt-2"
            >
              ← Back to All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

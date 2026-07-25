import { getAllMessages } from "@/app/_lib/data-service";
import Pagination from "@/app/_components/admin/Pagination";
import DeleteMessageButton from "@/app/_components/admin/DeleteMessageButton";

export default async function AdminMessagesPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;

  const { messages, totalCount, totalPages, currentPage } =
    await getAllMessages(page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Messages</h1>
        <span className="text-text-light text-sm">
          {totalCount || 0} total messages
        </span>
      </div>

      {!messages || messages.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center text-text-light">
          No messages yet.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-surface border border-border rounded-lg p-6 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-heading font-bold">
                      {message.first_name} {message.last_name}
                    </h3>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-text-light text-xs">
                      {new Date(message.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                    <DeleteMessageButton messageId={message.id} />
                  </div>
                </div>

                {message.subject && (
                  <p className="text-text font-medium text-sm">
                    Subject: {message.subject}
                  </p>
                )}

                <p className="text-text-light text-sm leading-relaxed bg-gray-light p-4 rounded">
                  {message.message}
                </p>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/messages"
          />
        </>
      )}
    </div>
  );
}

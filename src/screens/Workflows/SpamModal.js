import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Card,
} from "@tremor/react";

const SpamModal = ({ allEmails, setAllEmails, step }) => {
  console.log("all emails: ", allEmails);
  const empty = allEmails.length == 0;

  const switchEmail = (emailToChange) => {
    const updatedEmails = allEmails.map((email) =>
      email === emailToChange ? { ...email, isSpam: !email.isSpam } : email
    );
    setAllEmails(updatedEmails);
  };

  return (
    <>
      {empty && (
        <Card className="h-[50vh] text-center">
          <p className="text-slate-400">You don't have any email data</p>
        </Card>
      )}
      {!empty && (
        <Table className="h-[50vh]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Subject</TableHeaderCell>
              <TableHeaderCell>Content</TableHeaderCell>
              {step == 0 && (
                <TableHeaderCell className="text-center">
                  Category
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {allEmails.map((email, index) => (
              <TableRow key={index}>
                <TableCell className="w-[20%] whitespace-normal">
                  {email.customer ? email.customer : email.email}
                </TableCell>
                <TableCell className="w-[20%] whitespace-normal">
                  {email.data.subject}
                </TableCell>
                <TableCell className="w-[40%] whitespace-normal">
                  {email.summary}
                </TableCell>
                {step == 0 && (
                  <TableCell className="w-[10%] whitespace-normal text-center">
                    <button
                      style={{
                        backgroundColor: email.isSpam ? "#FF4D4D" : "#3B81F5",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        border: "none",
                        fontSize: "13px",
                      }}
                      onClick={() => switchEmail(email)}
                    >
                      {email.isSpam ? "Spam" : "Important"}
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default SpamModal;

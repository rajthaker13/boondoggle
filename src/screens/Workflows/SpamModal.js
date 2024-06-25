import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Button 
} from '@tremor/react';

const SpamModal = ({ emails, setFunction, otherEmails, otherSetFunction, step }) => {

    console.log("emails: ", emails);
    console.log("spam emails: ", otherEmails);

    const switchEmail = (emailToChange) => {
        setFunction(emails.filter(email => email !== emailToChange));
        otherSetFunction([...otherEmails, emailToChange]);
    };

    return (
    <Table className="h-[50vh]">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Sender</TableHeaderCell>
          <TableHeaderCell>Subject</TableHeaderCell>
          <TableHeaderCell>Content</TableHeaderCell>
          <TableHeaderCell>{step === 0 ? 'Mark as Spam' : 'Mark as Important'}</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {emails.map((email, index) => (
          <TableRow key={index}>
            <TableCell className="w-[20%] whitespace-normal">
              {email.author_member.name ? email.author_member.name : email.author_member.email}
            </TableCell>
            <TableCell className="w-[20%] whitespace-normal">
                {email.subject.length > 100 ? email.subject.slice(0, 85) + '...' : email.subject}
            </TableCell>
            <TableCell className="w-[40%] whitespace-normal">
                {email.message.length > 100 ? email.message.slice(0, 100) + '...' : email.message}
            </TableCell>
            <TableCell className="w-[10%] whitespace-normal text-center">
              <button
                style={{
                    backgroundColor: step === 0 ? '#FF4D4D' : '#3B81F5',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    border: 'none',
                }}
                onClick={() => switchEmail(email)}
              >
                {step === 0 ? 'Spam' : 'Important'}
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    );
};

export default SpamModal;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
  Card,
  Badge,
} from "@tremor/react";

import { useState } from "react";

const SpamModal = ({ allEmails, setAllEmails, step }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const empty = allEmails.length == 0;

  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
          <p className="text-slate-400">
            {step == 2
              ? "There were no updates to the CRM"
              : "You don't have any email data"}
          </p>
        </Card>
      )}
      {!empty && (step == 0 || step == 1) && (
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
            {allEmails.map((email, index) => {
              const isExpanded = expandedRows[index];
              return (
                <TableRow
                  key={index}
                  className="hover:cursor-pointer hover:bg-gray-100"
                  title={isExpanded ? "Click to minimize" : "Click to enlarge"}
                  onClick={() => toggleRowExpansion(index)}
                >
                  <TableCell className="w-[20%] whitespace-normal">
                    {email.customer ? email.customer : email.email}
                  </TableCell>
                  <TableCell className="w-[20%] whitespace-normal">
                    {isExpanded
                      ? email.title
                      : email.title.length > 80
                      ? email.title.slice(0, 60) + "..."
                      : email.title}
                  </TableCell>
                  <TableCell className="w-[40%] whitespace-normal">
                    {isExpanded
                      ? email.summary
                      : email.summary.length > 145
                      ? email.summary.slice(0, 135) + "..."
                      : email.summary}
                  </TableCell>
                  {step === 0 && (
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from toggling the expansion
                          switchEmail(email);
                        }}
                      >
                        {email.isSpam ? "Spam" : "Important"}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {!empty && step == 2 && (
        <AccordionList>
          {allEmails.map((modalObject, index) => (
            <Accordion key={index}>
              <AccordionHeader className="flex items-center justify-between text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <div className="mr-2">
                  {modalObject.contact.name}{" "}
                  {modalObject.company
                    ? "@ " + modalObject.company.name
                    : modalObject.contact.company
                    ? "@ " + modalObject.contact.company
                    : ""}
                </div>
                <div className="flex-grow"></div>
                <Badge
                  size="xs"
                  color={modalObject.contactIsNew ? "green" : "blue"}
                >
                  {modalObject.contactIsNew
                    ? "New Contact"
                    : "Existing Contact"}
                </Badge>
              </AccordionHeader>
              <AccordionBody className="leading-6 space-y-4">
                <div>
                  <strong>Contact:</strong>
                  <p>
                    {modalObject.contact.title != undefined
                      ? modalObject.contact.name +
                        ", " +
                        modalObject.contact.title
                      : modalObject.contact.name}
                  </p>
                </div>
                {modalObject.company && (
                  <div>
                    <strong>Company:</strong>
                    <p>{modalObject.company.name}</p>
                    <p>{modalObject.company.description}</p>
                  </div>
                )}
                {modalObject.events && modalObject.events.length > 0 && (
                  <Accordion className="mt-4">
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Notes
                    </AccordionHeader>
                    <AccordionBody className="leading-6">
                      {modalObject.events.map((event, idx) => (
                        <div key={idx} className="mt-2">
                          <strong>{event.title}</strong>
                          <p>{event.summary}</p>
                        </div>
                      ))}
                    </AccordionBody>
                  </Accordion>
                )}
              </AccordionBody>
            </Accordion>
          ))}
        </AccordionList>
      )}
    </>
  );
};

export default SpamModal;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

function ContactsDemo(props) {
  const [maxPriority, setMaxPriority] = useState(0);
  useEffect(() => {
    setMaxPriority(props.issues[0].priority);
    console.log("Data", props.issues);
  }, [props.issues]);

  return (
    <div className="overflow-y-auto">
      <Table className="h-[50vh]">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Missing Fields</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.issues.map((issue, index) => {
            let issueMissingFields = "";
            issue.missingFields.map((field) => {
              if (field == "emails[0].email") {
                issueMissingFields += "Email ";
              } else {
                issueMissingFields += `${
                  field.charAt(0).toUpperCase() + field.slice(1)
                } `;
              }
            });
            return (
              <TableRow key={index}>
                <TableCell className="w-[10vw] whitespace-normal">
                  {issue.itemData.name}
                </TableCell>
                <TableCell> {issueMissingFields}</TableCell>
                <TableCell>
                  {Math.round((issue.priority / maxPriority) * 100)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ContactsDemo;

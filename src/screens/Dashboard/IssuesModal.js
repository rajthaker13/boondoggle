import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

function IssuesModal(props) {
  const [maxPriority, setMaxPriority] = useState(0);
  useEffect(() => {
    setMaxPriority(props.allIssues[0].priority);
  }, [props.issues, props.allIssues]);

  return (
    <div className="overflow-y-auto">
      <Table className="h-[50vh]">
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              {props.type === "Contact"
                ? "Name"
                : props.type === "Company"
                ? "Company"
                : "ID"}
            </TableHeaderCell>
            <TableHeaderCell>Missing Fields</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            {props.type === "All" && <TableHeaderCell>Type</TableHeaderCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.issues.map((issue, index) => {
            let issueMissingFields = "";
            issue.missingFields.map((field) => {
              if (field == "emails[0].email" || field == "emails.email") {
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
                {props.type === "All" && <TableCell>{issue.type}</TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default IssuesModal;

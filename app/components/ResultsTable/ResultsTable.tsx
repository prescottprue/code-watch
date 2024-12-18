import { format } from "date-fns/format";

import type {
  CoverageSnapshotWithResult,
  Result,
} from "~/routes/repos.$repoId";

const timeZone = new Intl.DateTimeFormat("en-us", { timeZoneName: "short" })
  ?.formatToParts(new Date())
  ?.find((part) => part.type == "timeZoneName")?.value;

interface Props {
  coverageSnapshots: CoverageSnapshotWithResult[];
  repoUrl: string;
}

const defaultItemClass = "text-left";

export function ResultsTable({ coverageSnapshots, repoUrl }: Props) {
  return (
    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Branch
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ran
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Lines
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Branches
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Functions
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Statements
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Coverage
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {coverageSnapshots.map((snapshot, ind) => {
          const result: Result = snapshot.result as unknown as Result;
          return (
            <tr
              key={snapshot.id}
              className={
                ind % 2 === 0
                  ? defaultItemClass
                  : `${defaultItemClass} odd:bg-gray-100`
              }
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`${repoUrl}/tree/${snapshot.branch}`}>
                  {snapshot.branch}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(snapshot.createdAt, "MM/dd/yyyy h:m:s aa")} {timeZone}
              </td>
              {console.log('result', result)}
              <td className="px-6 py-4 whitespace-nowrap">
                {result.total.lines.covered} of {result.total.lines.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.total.branches.covered} of {result.total.branches.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.total.functions.covered} of{" "}
                {result.total.functions.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.total.statements.covered} of{" "}
                {result.total.statements.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {result.total.lines.pct}&#37;
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

import { Message } from "react-bulma-components";
import { mapValues } from "lodash-es";
import { Dictionary } from "async";

export interface PaginationInfoMessageProps {
  pageInfo: PaginationInfoMessageTypes;
  [key: string]: any;
}

export interface PaginationInfoMessageTypes {
  page: number;
  countPages: number;
  count: number;
  limit: number;
}

const PaginationInfoMessage: React.FunctionComponent<PaginationInfoMessageProps> = ({
  pageInfo: { page, countPages, count, limit },
  ...props
}) => {
  const idxFirst = (page - 1) * limit + 1;
  const idxLast = page === countPages ? count : page * limit;

  const strings: Dictionary<string> = mapValues(
    { page, countPages, count, idxFirst, idxLast },
    (n) => n.toLocaleString(),
  );

  return (
    <Message color="info" {...props}>
      <Message.Body>
        <span className="is-pulled-right">
          <em>
            Page <strong>{strings.page}</strong> of <strong>{strings.countPages}</strong>
          </em>
        </span>
        <span>
          Showing {strings.idxFirst}-{strings.idxLast} of <strong>{strings.count}</strong>{" "}
          total users.
        </span>
      </Message.Body>
    </Message>
  );
};

export default PaginationInfoMessage;

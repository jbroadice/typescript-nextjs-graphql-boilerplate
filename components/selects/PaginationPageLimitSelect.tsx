import Select from "react-select";
import { Props as SelectProps } from "react-select/lib/Select";
// import { withApollo } from "react-apollo";
import { ApolloClient } from "apollo-boost";
import { TableViewPaginationOptionsHOC, TablePaginationLimit } from "@types-generated";

export interface PaginationPageLimitSelectProps
  extends SelectProps<PaginationPageLimitSelectOption> {
  client?: ApolloClient<Object>;
  tablePaginationLimits?: TablePaginationLimit[];
  type: string;
}

export interface PaginationPageLimitSelectOption {
  value: number;
}

const options: PaginationPageLimitSelectOption[] = [
  { value: 10 },
  { value: 20 },
  { value: 30 },
];

const withClientData = TableViewPaginationOptionsHOC<PaginationPageLimitSelectProps>({
  options: {
    variables: {
      id: "users",
    },
  },
});

const PaginationPageLimitSelect: React.FunctionComponent<
  PaginationPageLimitSelectProps
> = (props) => {
  const onChange = (option: PaginationPageLimitSelectOption) => {
    console.log("boom", option);
  };

  console.log("test", props);

  return (
    <Select
      placeholder="Results per page..."
      {...props}
      instanceId={`${props.type.toLowerCase()}-page-limit`}
      options={options}
      onChange={onChange}
      formatOptionLabel={({ value }) =>
        value && <span>{`${value.toLocaleString()} results per page`}</span>
      }
      isSearchable={false}
    />
  );
};

export default withClientData(PaginationPageLimitSelect);

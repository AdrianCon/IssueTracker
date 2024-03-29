import {useQuery, useQueryClient} from "react-query";
import { useState } from "react";
import {IssueItem} from "./IssueItem";
import fetchWithError from "../helpers/fetchWithErrors";
import Loader from "./Loader";

export default function IssuesList({labels, status, pageNum, setPageNum}) {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const issuesQuery = useQuery(
    ["issues", {labels, status, pageNum}],
    async ({signal}) => {
      const statusString = status ? `&status=${status}` : '';
      const labelsString = labels.map((label) => `labels[]=${label}`).join('&');
      const paginationString = pageNum ? `&page=${pageNum}` : "";
      
      const results = await fetchWithError(`api/issues?${labelsString}${statusString}${paginationString}`, {signal});
      
      results.forEach((issue) => {
        queryClient.setQueryData(["issues", issue.number.toString()], issue);
      });

      return results;
    },
    {keepPreviousData: true, }
  )

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    () => fetch(`/api/search/issues?q=${searchValue}`).then(res => res.json()),
    {
      enabled: !!searchValue
    }
  )

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(event.target.search.value);
          setSearchValue(event.target.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if(event.target.value.length === 0) { 
              setSearchValue("");
            }
          }}
        />
      </form>
      <h2>Issue List {issuesQuery.isFetching ? <Loader />: null}</h2>
      {issuesQuery.isLoading ? <p>Loading...</p> :
      issuesQuery.isError ? <p>{issuesQuery.error.message}</p> :
      searchQuery.fetchStatus === "idle" && searchQuery.isLoading ? (
        <>
          <ul className={'issues-list'}>
            {issuesQuery.data.map((issue) => 
              <IssueItem
                key={issue.id}
                title={issue.title}
                number={issue.number}
                assignee={issue.assignee}
                commentCount={issue.comments.length}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                labels={issue.labels}
                status={issue.status}
              />
            )}
          </ul>
          <div className="pagination">
            <button
              onClick={() => setPageNum(pageNum-1)}
              disabled={pageNum === 1}
            >
              Previous
            </button>
            <p>Page {pageNum} {issuesQuery.isFetching && "..."}</p>
            <button
              onClick={() => {
                if(issuesQuery.data?.length !== 0 && !issuesQuery.isPreviousData) setPageNum(pageNum+1)
              }}
              disabled={issuesQuery.data?.length === 0 || issuesQuery.isPreviousData}
              >
                Next
              </button>
          </div>
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
                <ul className="issues-list">
                  {searchQuery.data.items.map((issue) => (
                    <IssueItem
                    key={issue.id}
                    title={issue.title}
                    number={issue.number}
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    labels={issue.labels}
                    status={issue.status}
                  />
                  ))}
                </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

import {useQuery} from "react-query";
import { useState } from "react";
import {IssueItem} from "./IssueItem";

export default function IssuesList({labels, status}) {
  const [searchValue, setSearchValue] = useState("");
  const issuesQuery = useQuery(
    ["issues", {labels, status}],
    () => {
      const statusString = status ? `&status=${status}` : '';
      const labelsString = labels.map((label) => `labels[]=${label}`).join('&');
      return fetch(`api/issues?${labelsString}${statusString}`).then(res => res.json())
    },
    {
      staleTime: 1000 * 60
    }
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
      <h2>Issue List</h2>
      {issuesQuery.isLoading ? <p>Loading...</p> : 
      searchQuery.fetchStatus === "idle" && searchQuery.isLoading ? (
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

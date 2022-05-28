import { useMutation, useQueryClient } from "react-query";
import { StatusSelect } from "./StatusSelect";

export default function IssueStatus({status, issueNumber}) {
  const queryClient = useQueryClient();
  const setStatus = useMutation((status) => {
    const oldStatus = queryClient.getQueryData(["issues", issueNumber]).status;

    return fetch(`/api/issues/${issueNumber}`,{
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({status})
    }).then(res=>res.json())
  }, {
    onMutate: (status) => {
      queryClient.setQueryData(
        ["issues",issueNumber],
        (data) => ({...data, status})
      );

      return () => {
        queryClient.setQueryData(
          ["issues", issueNumber],
          (data) => ({...data, status: oldStatus})  
        )
      }
    },
    onError: (error, variables, rollback) => {
      rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["issues", issueNumber], {exact:true})
    }
  })
  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(event) => {
            setStatus.mutate(event.target.value)
          }}
        />
      </div>
    </div>
  )
}
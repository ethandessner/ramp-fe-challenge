import { Fragment, useCallback, useEffect, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [employeeSelected, setEmployeeSelected] = useState(false)
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true)
  
  const transactions = () => {
    if(employeeSelected && transactionsByEmployee){
      return transactionsByEmployee;
    }
    return paginatedTransactions?.data ?? null;
  }

  useEffect(() => {
    setCheck(transactions)
  }, [employeeSelected,paginatedTransactions, transactionsByEmployee])
  
  const [check, setCheck] = useState(transactions)

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    setIsLoading(false)
   
    await paginatedTransactionsUtils.fetchAll()
    setEmployeeSelected(false)
   
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      setEmployeeSelected(true)
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
      
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])
  
  useEffect(() => {
    if (paginatedTransactions?.nextPage === null){
      setHasMoreTransactions(false)
    }else{
      setHasMoreTransactions(true)
    }
  },[paginatedTransactions?.nextPage])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            if(newValue.id === ''){
              setEmployeeSelected(false)
              await loadAllTransactions()
            }else{
              setEmployeeSelected(true)
              await loadTransactionsByEmployee(newValue.id)
            }        
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={check} />

          {employeeSelected === false  && transactions !== null && hasMoreTransactions === true &&(
            <button
              className="Rampb"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}

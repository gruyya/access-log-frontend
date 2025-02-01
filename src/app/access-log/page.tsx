'use client'

import {  useState } from "react";

const logEmployee = async (barcode:string) => {
    const response = await fetch('http://127.0.0.1:8000/api/employee-access-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
         body: JSON.stringify({barcode: barcode})
    });

    if(response.status === 200) {
        return response.json()
    }

    if(response.status != 200) {
        throw new Error("Network response was not ok");
    }
       
}        

type EmployeeResource = {
    name: string;
    image: string;
    rank: string;
    unit: string;
}

export default function AccessLog() {
    const [barcode, setBarcode] = useState('');
    const [employee, setEmployee] = useState<EmployeeResource | null>(null)

    const submit = async (e: any) => {
        e.preventDefault()
        setEmployee(null)
        
        if(!barcode ){
            console.log('Barcode required')
            return;
        }

        try{
            logEmployee(barcode).then((response) => {
                if(response.data) {
                    setEmployee(response.data as EmployeeResource)
                }
                setBarcode('')
            })
        } catch(e) {
            console.log(e)
        }
    }

    console.log(employee)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="barcode" className="block text-sm/6 font-medium text-gray-1900">
                Barcode
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setBarcode(e.target.value)}
                  id="barcode"
                  name="barcode"
                  type="barcode"
                  required
                  autoFocus
                  autoComplete="barcode"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

     

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
      </main>
    </div>

  );
}

"use client";

import { useAuth } from "@/contexts";
import useHandleLogout from "@/hooks/useHandleLogout";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const logEmployee = async (barcode: string, token: string) => {
  const response = await fetch(
    "http://127.0.0.1:8000/api/employee-access-log",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ barcode: barcode }),
    }
  );

  if (response.status === 200) {
    return response.json();
  }

  if (response.status != 200) {
    throw new Error("Network response was not ok");
  }
};

enum BarcodeType {
  IN = "in",
  OUT = "out",
}

type EmployeeResource = {
  name: string;
  image: string;
  rank: string;
  unit: string;
  barcode_type: BarcodeType;
};

export default function AccessLog() {
  const [barcode, setBarcode] = useState("");
  const [employee, setEmployee] = useState<EmployeeResource | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useAuth();
  const { onLogout } = useHandleLogout();

  useEffect(() => {
    if (!token) {
      redirect("/");
    }
  }, [token]);

  const submit = async (barcode: string) => {
    setEmployee(null);

    if (!token) {
      setErrorMessage("No authentication token");
      return;
    }

    if (!barcode) {
      setErrorMessage("No barcode");
      return;
    }

    try {
      logEmployee(barcode, token).then((response) => {
        if (response.data) {
          setEmployee(response.data as EmployeeResource);
        }
        setBarcode("");
      });
    } catch (e) {
      console.log(e);
    }
  };

  const checkBarcode = (barcode: string) => {
    setBarcode(barcode);

    if (barcode.length >= 4) {
      setEmployee(null);
      submit(barcode);
    }
  };
  console.log("barcode" + barcode);
  return (
    <div className="flex flex-col px-24 py-12">
      <button
        onClick={onLogout}
        className="bg-blue-500 ml-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-32"
      >
        Odjavi se
      </button>
      <main className="flex flex-col min-w-[820px] mt-36 items-center">
        {employee ? (
          <div className="flex sm:flex-row bg-gray-100 p-6 rounded-md shadow-md min-w-[820px] mb-16 items-center">
            <div className="text-8xl font-semibold text-gray-600">
              {employee?.barcode_type === BarcodeType.IN ? "ULAZ" : "IZLAZ"}
            </div>
            <div className="text-3xl text-gray-600 ml-auto flex flex-col items-left">
              <div className="font-semibold">
                {" "}
                Datum: {new Date().toLocaleDateString()}
              </div>
              <div className="font-semibold">
                {" "}
                Vreme: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse min-w-[820px] flex-none rounded-md bg-gray-300 mb-16  h-[144px]"></div>
        )}
        <div
          key={employee?.name}
          className="flex gap-20 sm:flex-row bg-gray-100 p-6 rounded-md shadow-md h-134 min-w-[820px]"
        >
          {employee?.image ? (
            <img
              alt="Picture of the employee"
              src={employee?.image}
              className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover bg-gray-500  h-64 self-center"
            />
          ) : (
            <div className="animate-pulse w-52 flex-none rounded-2xl object-cover bg-gray-300 h-64"></div>
          )}
          {employee ? (
            <div className="max-w-xl flex-auto mt-8">
              <div className="flex flex-row items-center gap-4">
                <p className="text-4xl font-semibold text-gray-600">
                  {" "}
                  Ime i prezime:
                </p>
                <h3 className="text-4xl font-semibold tracking-tight text-gray-700">
                  {employee?.name ?? "Name"}
                </h3>
              </div>

              <div className="flex flex-row items-center gap-4 mt-2">
                <p className="text-4xl font-semibold text-gray-600"> Čin:</p>
                <p className="text-4xl font-semibold text-green-800">
                  {employee?.rank ?? "rank"}
                </p>
              </div>

              <div className="flex flex-row items-center gap-4 self-bottom mt-12">
                <p className="text-4xl font-semibold text-gray-600">
                  {" "}
                  Jedinica:
                </p>
                <p className="text-4xl font-semibold text-green-800">
                  {employee?.unit ?? "unit"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-sm rounded-md p-4">
              <div className="flex animate-pulse space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-gray-200"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-22 w-[350px] mt-24">
          <div className="self-center">
            <form className="space-y-6 w-full shadow-sm">
              <div>
                <label
                  htmlFor="barcode"
                  className="block text-lg/6 text-gray-900 font-semibold text-center"
                >
                  Barcode
                </label>
                <div className="mt-4">
                  <input
                    value={barcode}
                    onChange={(e) => {
                      checkBarcode(e.target.value);
                    }}
                    id="barcode"
                    name="barcode"
                    type="text"
                    required
                    autoFocus
                    autoComplete="off"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      {!!errorMessage && (
        <div className="rounded-md bg-red-50 p-4 max-w-96">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Greska prilikom pokusaja logovanja zaposlenog
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  <li>{errorMessage}</li>
                </ul>
              </div>
            </div>
            <div className="shrink-0">
              <XCircleIcon
                aria-hidden="true"
                className="size-5 text-red-800"
                onClick={() => setErrorMessage("")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

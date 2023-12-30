import React from "react";

export default function StandardText() {
  return (
    <section className="w-full py-10">
      <h2 className="mb-10">
        Your standard texts, showing on all invoices. To update them, just
        change them.
      </h2>
      <form className="">
        <div className="flex gap-10">
          <label htmlFor="name" className="mt-2 ">
            Invoice Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full items-right"
          />
        </div>
        <div className="flex gap-10  my-8">
          <label htmlFor="name" className="mt-2">
            Reminder Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10">
          <label htmlFor="name" className="mt-2">
            Final Notice Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>

        <div className="flex gap-10 mt-8">
          <label htmlFor="name" className="mt-2">
            Creditnote Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10  my-8">
          <label htmlFor="name" className="mt-2">
            Order confirmation
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10">
          <label htmlFor="name" className="mt-2">
            Pack list Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>

        <div className="flex gap-10 mt-8">
          <label htmlFor="name" className="mt-2">
            Offer Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10  my-8">
          <label htmlFor="name" className="mt-2">
            English Text
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10">
          <label htmlFor="name" className="mt-2">
            Currency
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10 my-10">
          <label htmlFor="name" className="mt-2">
            IBAN
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10">
          <label htmlFor="name" className="mt-2">
            BIC/ Swift
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
        <div className="flex gap-10 mt-10">
          <label htmlFor="name" className="mt-2">
            Country
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter name"
            className="border border-solid border-[#ccc] rounded-[50px] px-2 py-2 w-full"
          />
        </div>
      </form>
    </section>
  );
}

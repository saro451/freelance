import renderDynamicLinks from "@/lib/DynamicLinks";

export default function Invalid({ invalid }: any) {
  return (
    <section className="m-auto">
      <div className="px-3 text-left error-div mt-5 border border-solid border-[red] w-full bg-[#fcebeb] py-1 rounded-lg mb-6">
        <p className="text-red-500 text-sm mt-1 ">
          {renderDynamicLinks(invalid, false)}
          sadasd
        </p>
      </div>
    </section>
  );
}

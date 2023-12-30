import renderDynamicLinks from "@/lib/DynamicLinks";

export default function Error({ error }: any) {
  return (
    <span className="text-red-500 text-sm mt-2 error-message-con">
      {renderDynamicLinks(error, false)}
    </span>
  );
}

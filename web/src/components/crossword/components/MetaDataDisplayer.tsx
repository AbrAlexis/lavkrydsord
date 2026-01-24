import "./MetaDataDisplayer.css";
function MetaDataDisplayer({
  id,
  title,
  author,
  date,
}: {
  id: number;
  title: string;
  author: string;
  date: string;
}) {
  console.log("id", id);

  return (
    <div className="metadata-displayer">
      {title} | by {author} created on {date}
    </div>
  );
}

export default MetaDataDisplayer;

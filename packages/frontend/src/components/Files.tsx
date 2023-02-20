import { Storage } from 'aws-amplify';
import { useQuery } from 'react-query';

const fetchFiles = () =>
  // TODO get tenant from store
  Storage.list('MYTENANT').then((res) =>
    res.results.map((f) => f.key)
  );

function Files() {
  const { isLoading, data, error, isError } = useQuery('files', fetchFiles);

  const uploadFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    try {
      // TODO get tenant from store
      await Storage.put(`MYTENANT/${file.name}`, file, {
        // level: 'public',
        // customPrefix: {
        //   public: 'MYTENANT/',
        // },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {(error as Record<'message', string>).message}</span>;
  }

  const listOfFiles = data?.map((file) => <li key={file}>{file}</li>);

  return (
    <div>
      <ul>{listOfFiles}</ul>
      <hr />
      <input type="file" onChange={(e) => uploadFile(e.target.files)} />
    </div>
  );
}

export default Files;

import { useState } from 'react';
import {
  Flex,
} from '@chakra-ui/react';
import DownloadForm from './components/DownloadForm';
import DownloadsDrawer from './components/DownloadsDrawer';

function App() {
  // UUIDs
  const [downloads, setDownloads] = useState([]);

  return (
    <Flex height="100vh" alignItems="center">
      <DownloadForm setDownloads={setDownloads} />
      <DownloadsDrawer downloads={downloads} />
    </Flex>
  );
}

export default App;

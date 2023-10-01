import {
  VStack,
  Heading
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DownloadProgress from './DownloadProgress';

function DownloadsDrawer({ downloads }) {
  return (
    <VStack flex={1} height="100vh" px={10} py={20} bg="teal" gap={4}>
      <Heading as="h2" fontSize="2xl" alignSelf="flex-start" color="white" mb={4}>Downloads ({downloads.length})</Heading>

      {downloads.map((download) => <DownloadProgress key={download.download_uuid} download={download} />)}
    </VStack>
  );
}

DownloadsDrawer.propTypes = {
  downloads: PropTypes.array.isRequired,
};

export default DownloadsDrawer;

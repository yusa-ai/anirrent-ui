import {
  VStack,
  Heading,
  Flex,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DownloadProgress from './DownloadProgress';

function DownloadsDrawer({ downloads }) {
  return (
    <VStack flex={1} height="100vh" px={10} py={20} bg="teal">
      <Heading as="h2" fontSize="2xl" alignSelf="flex-start" color="white" mb={8}>Downloads ({downloads.length})</Heading>

      <Flex direction="column" width="100%" gap={4} overflowY="auto">
        {downloads.map((download) => <DownloadProgress key={download.download_uuid} download={download} />)}
      </Flex>
    </VStack>
  );
}

DownloadsDrawer.propTypes = {
  downloads: PropTypes.array.isRequired,
};

export default DownloadsDrawer;

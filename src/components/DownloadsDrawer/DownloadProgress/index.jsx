import { useState, useEffect } from 'react';
import {
  Flex,
  Progress,
  Text,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function DownloadProgress({ download }) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    const fetchDownloadProgress = async () => {
      const response = await fetch(`http://localhost:8000/v1/download/${download.download_uuid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.progress;
    };

    const interval = setInterval(async () => {
      const progress = await fetchDownloadProgress();
      if (progress === 100) {
        clearInterval(interval);
      }
      setDownloadProgress(progress);
    }, 1000);

    return () => clearInterval(interval);
  }, [download]);

  useEffect(() => {
    if (downloadProgress === 100) {
      const fetchUploadStatus = async () => {
        const response = await fetch(`http://localhost:8000/v1/upload/${download.download_uuid}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        return data.status;
      };

      const interval = setInterval(async () => {
        const status = await fetchUploadStatus();
        if (status === 'COMPLETE') {
          clearInterval(interval);
          setUploadDone(true);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [downloadProgress, download.download_uuid]);

  const getUploadStringStatus = () => {
    if (uploadDone) {
      return 'Done';
    }
    if (downloadProgress === 100) {
      return 'In Progress';
    }
    return 'Pending';
  };

  return (
    <Flex direction="column" p={5} gap={2} width="100%" bg="white" borderRadius={5} boxShadow="xl">
      {/* Title */}
      <HStack justifyContent="space-between" >
        <Tooltip label="Zom 100: Zombie ni Naru Made ni Shitai 100 no Koto  - S01E01.mkv">
          <Text noOfLines={1} maxW="70%">{download.file_name}</Text>
        </Tooltip>
        {downloadProgress === 100 && uploadDone && (<CheckCircleIcon color="teal" />)}
      </HStack>

      {/* Progress bars */}
      <HStack justifyContent="space-between" >
        <Text color="blue.500">Download</Text>
        <Text color="blue.500">{downloadProgress === 100 ? 'Done' : `${Math.round(downloadProgress)}%`}</Text>
      </HStack>
      <Progress hasStripe value={downloadProgress} />
      <HStack justifyContent="space-between">
        <Text color="teal">Upload</Text>
        <Text color="teal">{getUploadStringStatus()}</Text>
      </HStack>
      <Progress hasStripe value={uploadDone ? 100 : 0} colorScheme="teal" isIndeterminate={downloadProgress === 100 && !uploadDone} />
    </Flex>
  );
}

DownloadProgress.propTypes = {
  download: PropTypes.shape({
    download_uuid: PropTypes.string.isRequired,
    file_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default DownloadProgress;
import { useState, useEffect } from 'react';
import {
  InputGroup,
  InputRightElement,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { Select, CreatableSelect } from 'chakra-react-select';

function App() {
  const [magnetUrl, setMagnetUrl] = useState('');

  const [entryType, setEntryType] = useState('TV'); // ['TV', 'MOVIE']
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await fetch(`http://localhost:8000/v1/entries?entry_type=${entryType}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      return data.map((entry) => {
        return {
          label: entry.entry_name,
          value: entry.entry_uuid,
        };
      });
    };

    fetchEntries().then((data) => {
      setEntries(data);
      setSelectedEntry(data[0]);
    });
  }, [entryType]);

  const entryTypeOptions = [
    { label: 'TV Show', value: 'TV' },
    { label: 'Movie', value: 'MOVIE' },
  ];

  const goToNyaa = () => {
    window.open('https://nyaa.si/', '_blank');
  };

  const createEntry = async (name) => {
    // Fake instant creation for seamless UX
    setSelectedEntry({ label: name, value: 'fake-uuid' });

    const response = await fetch('http://localhost:8000/v1/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entry_name: name, entry_type: entryType }),
    });

    if (response.ok) {
      const data = await response.json();
      const newEntry = { label: name, value: data.entry_uuid };
      setEntries([...entries, newEntry]);
      setSelectedEntry(newEntry);
    } else {
      setSelectedEntry(entries[0]);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/v1/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        magnet_url: magnetUrl,
        entry_name: selectedEntry.label,
        season: season,
        episode: episode,
      }),
    });

    if (response.ok) {
      // TODO show download progress
      console.log('Download started');
    }
  };

  return (
    <Center h="100vh" px="10%">
      <VStack flexBasis="100%" maxW="600px" spacing={4}>
        {/* Magnet URL */}
        <FormControl>
          <FormLabel>Magnet URL</FormLabel>
          <InputGroup>
            <Input placeholder="Magnet URL" value={magnetUrl} onChange={(e) => setMagnetUrl(e.target.value)} />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={goToNyaa}>
                Search
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Entry Type */}
        <FormControl>
          <FormLabel>Entry Type</FormLabel>
          <Select options={entryTypeOptions} defaultValue={entryTypeOptions[0]} onChange={(e) => setEntryType(e.value)} useBasicStyles />
        </FormControl>

        {/* Entry Name */}
        <FormControl>
          <FormLabel>Entry Name</FormLabel>
          <CreatableSelect options={entries} value={selectedEntry} onChange={(e) => setSelectedEntry(e)} onCreateOption={createEntry} useBasicStyles />
        </FormControl>

        <HStack width="100%">
          {/* Season */}
          <FormControl isDisabled={entryType === 'MOVIE'}>
            <FormLabel>Season</FormLabel>
            <NumberInput value={season} onChange={(value) => setSeason(value)} min={1}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Episode */}
          <FormControl isDisabled={entryType === 'MOVIE'}>
            <FormLabel>Episode</FormLabel>
            <NumberInput value={episode} onChange={(value) => setEpisode(value)} min={1}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>

        {/* Download */}
        <Button onClick={handleSubmit} leftIcon={<DownloadIcon />} colorScheme="purple" width="100%">
          Download
        </Button>
      </VStack>
    </Center >
  );
}

export default App;

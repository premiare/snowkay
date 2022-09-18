import { Text, Autocomplete, Container } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

export const Landing = () => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebouncedValue(searchValue, 500);

  return (
    <Container>
      <Text size="xl" weight={500}>
        snowkay
      </Text>
      <Container size="sm">
        <Autocomplete
          label="search for a city of mountain"
          placeholder="search"
          data={['one', 'two', 'three', 'four']}
        />
      </Container>
    </Container>
  );
};

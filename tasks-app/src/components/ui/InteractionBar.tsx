import { IconButton, IconButtonProps, Input, InputGroup, InputLeftAddon, Stack, Tooltip } from '@chakra-ui/react';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchbarProps {
  onButtonPress?: IconButtonProps['onClick']
}

const InteractionBar: React.FC<SearchbarProps> = (props) => {
  return (
    <Stack w={'full'} alignItems={'center'}>
      <InputGroup maxW={'500px'} bg={'white'}>
        <InputLeftAddon bg={'white'} color={'black'}>
          <FontAwesomeIcon icon={faSearch} />
        </InputLeftAddon>
        <Tooltip label={'A barra de pesquisa está desabilitada.'}>
          <Input isDisabled fontFamily={'Barlow'} placeholder={'Pesquise uma tarefa'} />
        </Tooltip>
        <Tooltip label={'Criar uma tarefa'} hasArrow>
          <IconButton
            colorScheme={'telegram'} 
            aria-label='Criar uma tarefa'
            onClick={props.onButtonPress}
            icon={<FontAwesomeIcon icon={faPlus}/>}
            ml={1}
          />
        </Tooltip>
      </InputGroup>
    </Stack>
  );
};

export default InteractionBar;

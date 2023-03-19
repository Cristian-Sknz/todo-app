import { PopoverHeader, HStack, Tooltip, IconButton, Text } from '@chakra-ui/react';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NotificationsHeaderProps {
  hasUnreads: boolean;
  isLoading: boolean;
  readAll(): void;
}

const markAsReadText = 'Marcar todos como lido';
 
const NotificationsHeader: React.FC<NotificationsHeaderProps> = (props) => {
  return (
    <PopoverHeader>
    <HStack justifyContent={'space-between'}>
      <Text>Notificações</Text>
      <Tooltip hasArrow label={markAsReadText}>
        <IconButton 
          aria-label={markAsReadText} 
          icon={<FontAwesomeIcon color={'green'} fontSize={16} icon={faCheckDouble} />}
          p={1}
          size={'sm'}
          isLoading={props.isLoading}
          isDisabled={!props.hasUnreads}
          onClick={props.readAll}
        />
      </Tooltip>
    </HStack>
  </PopoverHeader>
  );
}
 
export default NotificationsHeader;
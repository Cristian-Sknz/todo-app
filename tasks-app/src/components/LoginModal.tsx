import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
} from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';

interface LoginModalProps extends Omit<ModalProps, 'isOpen' | 'onClose' | 'children'> {
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { keycloak } = useKeycloak();

  return (
    <Modal {...props} isCentered isOpen={!keycloak.authenticated} onClose={() => null}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size={'md'}>Você precisa estar logado!</Heading>
        </ModalHeader>
        <ModalBody>Para poder utilizar os serviços, entre com a sua conta.</ModalBody>
        <ModalFooter>
          <Button onClick={() => keycloak.login({
            scope: 'authorities profile'
          })} colorScheme={'telegram'}>Logar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;

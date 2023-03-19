import React, { useImperativeHandle, useState }  from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  ModalProps,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import useMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';

interface DeleteTaskModalProps extends Omit<ModalProps, 'children' | 'isOpen' | 'onClose'> {
  deleter(path: `/tasks/${string}`): Promise<unknown>
}

export interface DeleteTaskHandler {
  open(id: string): void;
}

const DeleteTaskModal = React.forwardRef<DeleteTaskHandler, DeleteTaskModalProps>((props, ref) => {
  const [id, setId] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, { on, off }] = useBoolean();
  
  const { trigger } = useMutation(`/tasks/${id}`, props.deleter);
  const { mutate } = useSWRConfig();

  useImperativeHandle(ref, () => ({
    open: (id: string) => {
      onOpen();
      setId(id);
    }
  }), []);

  return (
    <Modal {...props} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Você tem certeza que quer deletar?</Text>
        </ModalHeader>
        <ModalBody>
          Você está prestes a deletar uma tarefa, essa tarefa não pode ser recuperada após
          este ato, você confirma?
        </ModalBody>
        <ModalFooter>
          <Button 
            isLoading={isLoading} 
            loadingText={'Deletando'} 
            colorScheme={'red'}
            onClick={() => {
              on();
              trigger().finally(() => {                
                off();
                mutate('/notifications/all');
                mutate('/tasks').finally(onClose);
              });
            }}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default DeleteTaskModal;

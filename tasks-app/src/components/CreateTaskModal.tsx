import { useEffect } from 'react';
import * as yup from 'yup'
import dayjs from 'dayjs';
import useMutation from 'swr/mutation'
import { Button, FormControl, FormErrorIcon, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, Textarea } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';

interface CreateTaskModalProps extends Omit<ModalProps, 'children'> {
  poster(path: '/tasks', args: { arg: any }): any;
}

const getSchema = () => yup.object({
  name: yup.string().min(4, 'Insira um titulo com mais de 4 caracteres.'),
  description: yup.string().optional().nullable(),
  ends_in: yup.date()
    .typeError("Insira uma data valida")
    .min(new Date(), 'Você não pode usar datas/horário menor que agora!')
    .max(dayjs().add(2, 'weeks').toDate(), 'Você só pode agendar tarefas entre hoje e 2 semanas.')
    .required('Você precisa preencher uma data'),
  completed: yup.boolean().default(false).nullable()
});
 
const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ poster, ...modalProps }) => {
  const { handleSubmit, register, formState: { errors } } = useForm<any>({
    resolver: yupResolver(getSchema())
  });
  const { trigger, reset, isMutating } = useMutation('/tasks', poster);

  const onSubmit = (e: any) => {
    trigger(e).then(modalProps.onClose);
  }

  useEffect(() => {
    reset();
  }, []);

  return (
    <Modal {...modalProps}>
      <ModalOverlay/>
      <ModalContent as={'form'} onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          Criar uma tarefa
          <ModalCloseButton/>
        </ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!errors?.name}>
            <FormLabel>Titulo</FormLabel>
            <Input {...register('name')} placeholder='Insira um titulo'/>
            <FormErrorMessage>
              <FormErrorIcon/>
              {(errors?.name?.message?.toString()) || ''}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea {...register('description')} placeholder='Insira uma descrição'/>
          </FormControl>
          <FormControl isInvalid={!!errors?.ends_in}>
            <FormLabel>Data de término</FormLabel>
            <Input 
              min={dayjs().format('YYYY-MM-DDThh:mm')} 
              max={dayjs().add(14, 'days').format('YYYY-MM-DDThh:mm')}
              type={'datetime-local'}
              {...register('ends_in')}
            />
            <FormErrorMessage>
              <FormErrorIcon/>
              {(errors?.ends_in?.message?.toString()) || ''}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button colorScheme={'blackAlpha'}>Cancelar</Button>
          <Button isLoading={isMutating} name={'criar'} type='submit' aria-label='Criar a tarefa' colorScheme={'telegram'}>Criar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
 
export default CreateTaskModal;
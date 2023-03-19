package me.sknz.ms.tasks.notification.listeners

import me.sknz.ms.tasks.notification.configuration.RabbitMQConfiguration
import me.sknz.ms.tasks.notification.entity.Task
import me.sknz.ms.tasks.notification.entity.TaskNotification
import me.sknz.ms.tasks.notification.entity.TaskNotification.NotificationType
import me.sknz.ms.tasks.notification.model.TaskModel
import me.sknz.ms.tasks.notification.repository.TaskAuthorRepository
import me.sknz.ms.tasks.notification.repository.TaskNotificationRepository
import me.sknz.ms.tasks.notification.repository.TaskRepository
import org.springframework.amqp.core.Message
import org.springframework.amqp.core.MessageProperties
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Component
import java.util.function.Consumer

/**
 * ## TaskDeleteNotificationListener
 *
 * Classe responsável por receber mensagens da fila do RabbitMQ
 * e criar notificações informando deleções de tarefas.
 */
@Component
class TaskDeleteNotificationListener(
    private val template: RabbitTemplate,
    private val credentials: RabbitMQConfiguration,
    private val notifications: TaskNotificationRepository,
    private val tasks: TaskRepository,
    private val users: TaskAuthorRepository
) : JsonMessageListener() {

    /**
     * Esta função ira receber um [TaskModel] procurar pela [Task],
     * criar uma notificação informando que uma tarefa foi deletada,
     * e cancelar agendamentos de término de tarefas.
     */
    override fun onMessage(message: Message) {
        val model = message.parse<TaskModel>()
        val task = tasks.findById(model.id).orElseGet {
            model.toTask(users.getAuthor(model.author)).let(tasks::save)
        }

        notifications.createSentNotification(task, NotificationType.DELETION)
        notifications.findByTaskIdAndType(model.id, NotificationType.CREATION).ifPresent {
            cancelSchedule(it)
        }
    }

    /**
     * Esta função ira cancelar uma tarefa agendada atraves de uma fila no RabbitMQ
     */
    fun cancelSchedule(notification: TaskNotification) {
        val properties = MessageProperties().apply {
            messageId = notification.id.toString()
            headers["x-cancel-scheduled-message"] = true
        }

        template.send(credentials.exchange, credentials.getEmailNotificationRoutingKey(), Message(byteArrayOf(), properties))
    }
}
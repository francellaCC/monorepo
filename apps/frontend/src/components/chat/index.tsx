
import './styles.scss'


function ChatComponent({messages}: {messages: {name: string; message: string; timestamp: number; playerId: string}[]}) {


 
  return (<div className="chat-component">
    <div className="flex gap-2 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex-1">
        <div className="flex flex-col items-baseline gap-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">{msg.name}:</span> {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default ChatComponent

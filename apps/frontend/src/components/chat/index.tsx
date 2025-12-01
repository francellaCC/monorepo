
import './styles.scss'


function ChatComponent({message}: {message?: string}) {


 
  return (<div className="chat-component">
    <div className="flex gap-2 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-700"></span>
          {message}
        </div>
      </div>
    </div>
  </div>
  )
}

export default ChatComponent

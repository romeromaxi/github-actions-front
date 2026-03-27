import ConversationContextProvider from 'hooks/contexts/ConversationContext';
import ChatCard from 'components/chat/ChatCard';
import { useProductLineDetail } from '../ProductLineDetailContext';
import ProductLineDetailLayoutPage from '../components/ProductLineDetailLayoutPage';

function ProductLineDetailChatPage() {
  const { lineId, offerer } = useProductLineDetail();
  const titleChat = offerer ? 'Chat con LUC' : 'Chat con el Oferente';
  const emptyMessage = offerer ?
    {
      title: titleChat,
      description: 'Este es el inicio de tu chat con LUC para la publicación de la línea en la tienda.' 
    } :
    {
      title: titleChat, 
      description: 'Este es el inicio de tu chat con el oferente para la publicación de la línea en la tienda.'
    };

  return (
    <ProductLineDetailLayoutPage>
      <ConversationContextProvider>
        <ChatCard productLineId={lineId}
                  title={titleChat}
                  emptyMessage={emptyMessage}
        />
      </ConversationContextProvider>
    </ProductLineDetailLayoutPage>
  );
}

export default ProductLineDetailChatPage;

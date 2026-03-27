import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DialogVideoSource from "../../components/dialog/DialogVideoSource";

const pageMap: Record<string, string> = {
    'que-es-luc': 'que-es-luc.html',
    'soluciones': 'soluciones.html',
    'preguntas-frecuentes': 'preguntas-frecuentes.html',
    'instructivos': 'instructivos.html',
    'glosario': 'glosario.html',
    'contacto': 'contacto.html',
};

interface VideoSource {
    open: boolean,
    url: string,
    title: string
}

interface GuidesHtmlEmbeddedPageProps {
    urlBase: string;
    actualHtmlPage: string;
    onNotFoundHtmlPage?: (namePage: string) => void;
}

function GuidesHtmlEmbeddedPage(props: GuidesHtmlEmbeddedPageProps) {
    const navigate = useNavigate();    
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState<string>('0px');
    const [videoData, setVideoData] = useState<VideoSource>({ open: false, url: '', title: '' });

    const pageFile = pageMap[props.actualHtmlPage] ?? 'que-es-luc.html';

    const hideVideo = () => setVideoData({ open: false, url: '', title: '' });
    
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'resize-iframe-ayuda') {
                setIframeHeight(event.data.height + 'px');
            }

            if (event.data?.type === 'navigate-instructivo-ayuda') {
                const newSlug = Object.entries(pageMap).find(([key, val]) => val === event.data.page)?.[0];
                
                if (newSlug) {
                    if (newSlug === 'contacto')
                        navigate(`/contacto`);
                    else
                        navigate(`/${props.urlBase}/${newSlug}`);
                }
                else if (props.onNotFoundHtmlPage) props.onNotFoundHtmlPage(event.data.page);
            }

            if (event.data?.type === "open-video") {
                setVideoData({
                    open: true,
                    url: event.data.videoId,
                    title: event.data.videoTitle || "Video"
                })
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    
    return (
        <React.Fragment>
            <iframe
                ref={iframeRef}
                src={`/guides/${pageFile}`}
                style={{ width: '100%', height: iframeHeight, border: 'none' }}
                title={props.actualHtmlPage}
            />

            <DialogVideoSource open={videoData.open}
                               source={videoData.url}
                               title={videoData.title}
                               onClose={hideVideo}
            />
        </React.Fragment>
    )
}

export default GuidesHtmlEmbeddedPage;
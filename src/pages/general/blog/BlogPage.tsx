import {Stack} from "@mui/material";
import BlogNews from "./components/BlogNews";
import {useNavigate} from "react-router-dom";


function BlogPage() {
    const navigate = useNavigate();
    
    return (
        <Stack spacing={11} mt={11}>
            <BlogNews variant="image-left"
                      news={{
                          title: "Scoring crediticio pyme gratis: cómo acceder online a la información de la empresa que existe en el mercado",
                          description: "En el proceso de buscar financiamiento, todas las empresas e individuos son sometidos a un análisis de su historia crediticia y de su situación actual como clientes del sistema financiero. ¿De dónde salen esos indicadores? ¿Cuánto pesan en la decisión del que otorga el préstamo?",
                          date: "30/12/2025",
                          readTime: "4 minutos de lectura",
                          imageSrc: "/images/blogs/3282E61C-7FC1-46EF-A940-2EC2BD51976F.png",
                          handleClickNews: () => navigate('/blog/3282E61C-7FC1-46EF-A940-2EC2BD51976F')
                      }}
            />

            <Stack direction={{ xs: 'column', md: 'row' }}
                   spacing={{ xs: 11, md: 14.5 }}
            >
                <BlogNews variant="image-top"
                          news={{
                              title: "Qué debe tener en cuenta una Pyme antes de pedir un crédito",
                              description: "El proceso de obtener una línea de crédito para una pequeña y mediana empresa puede sonar a priori más complejo de lo que es. Se sabe que, por razones históricas, muchos emprendedores y empresarios pyme apelan al capital propio para financiar sus proyectos, pero ese recurso es limitado en comparación con el volumen con el que cuenta el mercado financiero.", 
                              date: "29/12/2025",
                              readTime: "5 minutos de lectura",
                              imageSrc: "/images/blogs/16AF8914-192C-46CF-A8C0-A9AA76EA1978.png",
                              handleClickNews: () => navigate('/blog/16AF8914-192C-46CF-A8C0-A9AA76EA1978')
                          }}
                />

                <BlogNews variant="image-top"
                          news={{
                              title: "Financiamiento para PyMEs en Argentina: qué tipo de crédito conviene según la necesidad y objetivo del negocio",
                              description: "En la actualidad, acceder a financiamiento para PyMEs se ha convertido en un desafío clave para sostener el crecimiento y la competitividad. Las pequeñas y medianas empresas deben analizar con precisión qué líneas de crédito PyME se ajustan mejor a sus necesidades, ya sea para capital de trabajo, inversiones o expansión comercial.",
                              date: "17/12/2025",
                              readTime: "4 minutos de lectura",
                              imageSrc: "/images/blogs/5B052D53-4167-4B46-8046-F36474E4105B.png",
                              handleClickNews: () => navigate('/blog/5B052D53-4167-4B46-8046-F36474E4105B')
                          }}
                />
            </Stack>

            <BlogNews variant="image-right"
                      news={{
                          title: "Indicadores financieros para PyMEs: cuáles tener en cuenta antes de pedir un crédito",
                          description: "Conocé los principales indicadores financieros para PyMEs en Argentina que evalúan los bancos antes de otorgar un crédito: liquidez, flujo de caja, EBITDA, margen de rentabilidad y más.",
                          date: "15/12/2025",
                          readTime: "5 minutos de lectura",
                          imageSrc: "/images/blogs/036A45FA-8042-4420-97FE-2C159186B1B9.png",
                          handleClickNews: () => navigate('/blog/036A45FA-8042-4420-97FE-2C159186B1B9')
                      }}
            />
            
            <Stack direction={{ xs: 'column', md: 'row' }}
                   spacing={{ xs: 11, md: 14.5 }}
            >
                <BlogNews variant="image-top"
                          news={{
                              title: "Qué Instrumentos de financiamiento existen para PyMEs",
                              description: "Conoce los instrumentos de financiamiento para PyMEs: crédito bancario, capital de trabajo, adelantos en cuenta corriente, descuento de cheques, créditos para inversión, prefinanciar exportaciones y opciones del mercado de capitales.",
                              date: "12/12/2025",
                              readTime: "6 minutos de lectura",
                              imageSrc: "/images/blogs/DBF81C9A-7CE1-4982-8263-5E08D5BC3673.png",
                              handleClickNews: () => navigate('/blog/DBF81C9A-7CE1-4982-8263-5E08D5BC3673')
                          }}
                />

                <BlogNews variant="image-top"
                          news={{
                              title: "Cómo pedir un crédito PyME y qué requisitos se necesitan: todo lo que hay que saber",
                              description: "Qué necesita una PyME para pedir un crédito: certificado MiPyME, balances, avales y opciones de financiamiento y plazos. Descubre los tipos de créditos, documentación y claves para acceder al crédito más conveniente.",
                              date: "12/12/2025",
                              readTime: "6 minutos de lectura",
                              imageSrc: "/images/blogs/9473EAF1-7333-4086-83E3-B7F1582022F1.png",
                              handleClickNews: () => navigate('/blog/9473EAF1-7333-4086-83E3-B7F1582022F1')
                          }}
                />
            </Stack>
        </Stack>
    )
}

export default BlogPage;
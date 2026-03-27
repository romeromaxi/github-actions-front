import {ReactNode} from "react";

export enum BlogFlyerType {
    General,
    Bureau
}

export interface SectionContent {
    type: 'title' | 'subtitle' | 'description' | 'link' | 'list';
    content: ReactNode | string[];
    variant?: string;
    href?: string;
    color?: string;
}

export const blogData: {
    id: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    imageSrc: string;
    flyerType?: BlogFlyerType;
    sections: SectionContent[];
}[] = [
    {
        id: "5B052D53-4167-4B46-8046-F36474E4105B",
        title: "Financiamiento para PyMEs en Argentina: qué tipo de crédito conviene según la necesidad y objetivo del negocio",
        description: "En la actualidad, acceder a financiamiento para PyMEs se ha convertido en un desafío clave para sostener el crecimiento y la competitividad. Las pequeñas y medianas empresas deben analizar con precisión qué líneas de crédito PyME se ajustan mejor a sus necesidades, ya sea para capital de trabajo, inversiones o expansión comercial.",
        date: "17/12/2025",
        readTime: "4 minutos de lectura",
        imageSrc: "/images/blogs/5B052D53-4167-4B46-8046-F36474E4105B.png",
        flyerType: BlogFlyerType.General,
        sections: [
            {
                type: 'title',
                content: 'Financiamiento de corto plazo: préstamos de capital de trabajo'
            },
            {
                type: 'description',
                content: 'Las opciones de <strong>créditos de corto plazo para PyMEs</strong> se utilizan generalmente para cubrir gastos operativos o necesidades de liquidez inmediatas. Dentro de este grupo, se destacan alternativas como el acuerdo o descubierto en cuenta corriente, el <strong>descuento de cheques</strong> y los pagarés bursátiles.'
            },
            {
                type: 'subtitle',
                content: 'Acuerdo o descubierto en cuenta corriente'
            },
            {
                type: 'description',
                content: 'Permite a la empresa utilizar fondos adicionales hasta un límite previamente acordado con el banco. Es una herramienta útil para enfrentar imprevistos de caja o desfasajes temporales de ingresos y egresos.'
            },
            {
                type: 'subtitle',
                content: 'Descuento de cheques: cómo funciona'
            },
            {
                type: 'description',
                content: 'A través del <strong>descuento de cheques</strong>, la empresa puede <strong>anticipar el cobro de sus ventas</strong>. Al presentar un cheque diferido, la entidad financiera adelanta el monto correspondiente, descontando los intereses y comisiones. Esta modalidad es muy común entre las PyMEs, ya que ofrece liquidez inmediata y condiciones relativamente flexibles.'
            },
            {
                type: 'subtitle',
                content: 'Otras opciones para descontar documentos'
            },
            {
                type: 'description',
                content: 'Además del descuento de cheques, las PyMEs pueden acceder a instrumentos como el <strong>pagaré bursátil</strong> o la <strong>factura de crédito electrónica</strong>, que amplían las fuentes de financiamiento y suelen tener tasas competitivas.'
            },
            {
                type: 'subtitle',
                content: 'Pagarés bursátiles'
            },
            {
                type: 'description',
                content: 'Permiten obtener fondos directamente del mercado de capitales mediante la emisión de pagarés negociables. Esta opción se ha consolidado como una alternativa eficiente frente al crédito bancario tradicional.'
            },
            {
                type: 'subtitle',
                content: 'Factura de crédito electrónica'
            },
            {
                type: 'description',
                content: 'Instrumento que permite a las empresas <strong>financiarse mediante la cesión de facturas emitidas a grandes clientes</strong>, brindando mayor previsibilidad en la gestión de cobranzas.'
            },
            {
                type: 'title',
                content: 'Financiamiento de largo plazo: planes de inversión'
            },
            {
                type: 'description',
                content: 'Cuando el objetivo es invertir en bienes de capital, ampliaciones o proyectos estratégicos, se recomiendan <strong>créditos de largo plazo para PyMEs</strong>, con tasas y plazos acordes a los flujos del negocio. Algunas de estas líneas se canalizan a través de esquemas como el <strong>leasing</strong>, que funciona como un alquiler con opción de compra al finalizar el contrato y cuenta con beneficios impositivos. Los plazos de devolución de los créditos para inversión productiva son más largos, así como el proceso de aprobación por parte de la entidad bancaria, ya que se demandan más requisitos que para las líneas de capital de trabajo e información sobre el proyecto.'
            },
            {
                type: 'subtitle',
                content: 'Obligación Negociable (ON)'
            },
            {
                type: 'description',
                content: 'Las <strong>Obligaciones Negociables simples</strong> representan otra vía de acceso al <strong>financiamiento productivo PyME</strong>. Permiten emitir deuda en el mercado local para obtener fondos destinados a proyectos de inversión o reestructuración de pasivos.'
            },
            {
                type: 'title',
                content: 'Cómo elegir la opción más conveniente'
            },
            {
                type: 'description',
                content: 'Antes de solicitar un crédito, es clave evaluar el destino de los fondos, los plazos de devolución y el costo financiero total. Las <strong>PyMEs en Argentina</strong> cuentan hoy con un abanico de herramientas —bancarias y del mercado de capitales— que pueden potenciar su desarrollo si se utilizan estratégicamente.'
            },
            {
                type: 'description',
                content: 'En definitiva, elegir el <strong>financiamiento adecuado para PyMEs</strong> depende de comprender el momento del negocio, su capacidad de pago y los objetivos de crecimiento.'
            }
        ]
    },
    {
        id: "036A45FA-8042-4420-97FE-2C159186B1B9",
        title: "Indicadores financieros para PyMEs: cuáles tener en cuenta antes de pedir un crédito",
        description: "Conocé los principales indicadores financieros para PyMEs en Argentina que evalúan los bancos antes de otorgar un crédito: liquidez, flujo de caja, EBITDA, margen de rentabilidad y más.",
        date: "15/12/2025",
        readTime: "5 minutos de lectura",
        imageSrc: "/images/blogs/036A45FA-8042-4420-97FE-2C159186B1B9.png",
        flyerType: BlogFlyerType.Bureau,
        sections: [
            {
                type: 'description',
                content: 'A la hora de analizar <strong>qué tipo de crédito PyME conviene solicitar</strong> —desde el monto hasta la tasa de interés, el plazo y el destino específico que se le dará—, hay que tener en cuenta que los bancos evalúan una serie de <strong>métricas e indicadores financieros</strong> de las pequeñas y medianas empresas.' + '\n' +
                    'Por eso, para cualquier emprendedor o PyME que busque <strong>acceder a financiamiento</strong>, resulta clave conocer cuáles son esos <strong>indicadores financieros clave</strong> y qué importancia tiene cada uno antes de solicitar un préstamo.'
            },
            {
                type: 'title',
                content: 'Historial crediticio y antecedentes financieros'
            },
            {
                type: 'description',
                content: 'El primer punto que las entidades suelen mirar es el <strong>historial crediticio PyME</strong>. Esto es, cuáles son los antecedentes de pago de deudas de la firma y de los dueños en el sistema financiero.' + '\n' +
                    'Un historial sin situaciones irregulares aumentará las posibilidades de <strong>calificar para un crédito PyME</strong> y acceder a <strong>mejores condiciones de financiamiento</strong>.' + '\n' +
                    'Esto significa que contar con una situación de deuda normal 1 en el <strong>Banco Central (BCRA)</strong> para sus créditos informados es visto como un buen dato, siempre que el nivel de endeudamiento sea acorde con el giro de la empresa. Cuanto más cerca se esté de ese nivel, habrá más probabilidades de obtener un crédito (aunque una situación 2 no es excluyente tampoco).' + '\n' +
                    'El <strong>BCRA</strong> lleva también un registro de incumplimiento de cheques. Si la empresa tiene antecedentes en esa base, su calificación crediticia será peor, por lo que es importante resolver cualquier impago.'
            },
            {
                type: 'title',
                content: 'Principales indicadores financieros que miran los bancos'
            },
            {
                type: 'description',
                content: 'El <strong>estado financiero de una PyME</strong> es evaluado a través de varios indicadores. A continuación, los más relevantes para <strong>solicitar un crédito empresarial</strong>:'
            },
            {
                type: 'subtitle',
                content: 'Ratio de endeudamiento'
            },
            {
                type: 'description',
                content: 'Este índice refleja la proporción del negocio de la PyME que está financiado con deuda. Se calcula dividiendo el pasivo total sobre el patrimonio neto.' + '\n' +
                    'Como referencia, se mira si el indicador es mayor, igual o menor que uno. La situación varía en función de la actividad de la firma.'
            },
            {
                type: 'subtitle',
                content: 'Flujo de caja (cash flow)'
            },
            {
                type: 'description',
                content: 'Muestra los ingresos y egresos reales de dinero que tiene la empresa en un período de tiempo.' + '\n' +
                    'Con la evaluación del <strong>cash flow</strong>, la entidad otorgante del crédito medirá cuánto efectivo genera la PyME para operar y pagar sus deudas.' + '\n' +
                    'Cuando el <strong>flujo de caja es positivo</strong>, hay señal de <strong>salud financiera</strong>.' + '\n' +
                    'El control del <strong>cash flow empresarial</strong> es una herramienta fundamental del seguimiento del negocio.' + '\n' +
                    'Por lo general, se solicita el cash flow para <strong>préstamos PyME de largo plazo</strong> (de más de dos años).'
            },
            {
                type: 'subtitle',
                content: 'Liquidez'
            },
            {
                type: 'description',
                content: 'Es el número que mide con cuánto dinero cuenta la firma para hacer frente a sus obligaciones.' + '\n' +
                    'La <strong>liquidez corriente</strong> se calcula dividiendo el activo corriente (líquido) sobre el pasivo corriente.' + '\n' +
                    'Si es mayor a 1, implica que la empresa tiene activos disponibles para cubrir sus pasivos a corto plazo.'
            },
            {
                type: 'subtitle',
                content: 'EBITDA'
            },
            {
                type: 'description',
                content: 'Se trata de un indicador clave para todas las empresas.' + '\n' +
                    'La sigla deriva del inglés Earnings Before Interests, Taxes, Depreciation and Amortization (ganancias antes del pago de intereses, impuestos, depreciaciones y amortizaciones).' + '\n' +
                    'El <strong>EBITDA PyME</strong> refleja la rentabilidad operativa de una compañía y es analizado como la capacidad de la firma de generar ingresos a partir de su actividad principal.' + '\n' +
                    'Si el <strong>EBITDA es positivo</strong>, significa que la empresa tiene una operación que funciona y que es capaz de generar ganancias.' + '\n' +
                    'El indicador no solo es analizado por una entidad financiera para conceder un crédito PyME, sino que también se utiliza para calcular la </strong>valuación de una empresa<strong>.'
            },
            {
                type: 'title',
                content: 'Indicadores de rentabilidad de una PyME'
            },
            {
                type: 'description',
                content: 'Para medir la rentabilidad PyME, los bancos pueden solicitar otros dos indicadores clave:'
            },
            {
                type: 'subtitle',
                content: 'Margen bruto'
            },
            {
                type: 'description',
                content: 'Muestra qué porcentaje de la facturación queda disponible después de cubrir los costos de la operación (producción, ventas).' + '\n' +
                    'Cuando el margen bruto es adecuado, se interpreta que la empresa está generando valor con sus ventas y puede afrontar sus gastos fijos.' + '\n' +
                    'Su fórmula es utilidad bruta dividido los ingresos totales.'
            },
            {
                type: 'subtitle',
                content: 'Margen neto'
            },
            {
                type: 'description',
                content: 'Refleja la ganancia final, luego de haber cubierto todos los gastos (incluidos los financieros e impositivos).' + '\n' +
                    'Es un indicador que habla de la gestión del negocio PyME.' + '\n' +
                    'Si el margen neto es bajo o muy bajo, puede ser un síntoma de problemas financieros o de costos.' + '\n' +
                    'Se calcula dividiendo la utilidad neta sobre las ventas.'
            },
            {
                type: 'title',
                content: 'Ventas promedio y ROI: otros factores que analizan las entidades'
            },
            {
                type: 'description',
                content: 'Otro dato que puede entrar en la evaluación de una PyME al momento de pedir un crédito es el <strong>promedio de ventas de los últimos años</strong>.' + '\n' +
                    'Para acceder a un crédito, algunas entidades pueden solicitar un mínimo de 24 meses de antigüedad, aunque hay líneas que tienen menores requisitos de tiempo en el mercado.' + '\n' +
                    'En el caso de un <strong>proyecto de inversión PyME</strong>, la variable que se emplea para medir su viabilidad es el <strong>Retorno sobre la Inversión (ROI)</strong>, que establece la relación entre la ganancia esperada y el desembolso contemplado.' + '\n' +
                    'Se trata de un <strong>índice de eficiencia financiera</strong>, que se calcula dividiendo la utilidad neta sobre el activo total.'
            },
            {
                type: 'title',
                content: 'Scoring crediticio: qué es y cómo funciona'
            },
            {
                type: 'description',
                content: 'Como parte del análisis que realizan, los bancos utilizan un sistema de <strong>scoring crediticio</strong> PyME para evaluar la situación de un cliente.' + '\n' +
                    'El <strong>scoring crediticio</strong> toma en cuenta el historial crediticio, los cumplimientos de los pagos y el comportamiento financiero de la firma.' + '\n' +
                    'Hay que tener presente que cada entidad emplea sus propias metodologías de análisis de riesgo, lo cual suele incorporar además el scoring de burós de crédito.' + '\n' +
                    'Cuanto más alto es el puntaje, mejor es la condición para acceder a una línea crediticia y obtener <strong>mejores tasas o plazos en el financiamiento PyME</strong>.'
            },
            {
                type: 'title',
                content: 'Conclusión: preparar los indicadores antes de pedir financiamiento'
            },
            {
                type: 'description',
                content: 'Conocer los <strong>indicadores financieros para PyMEs</strong> permite anticipar qué miran los bancos al evaluar una solicitud de crédito.' + '\n' +
                    'Controlar indicadores como el <strong>flujo de caja</strong>, <strong>la liquidez</strong>, <strong>el endeudamiento</strong> o <strong>los márgenes de rentabilidad</strong> mejora la salud financiera de la empresa y <strong>aumenta sus posibilidades de acceder a un crédito PyME en mejores condiciones</strong>.'
            }
        ]
    },
    {
        id: "DBF81C9A-7CE1-4982-8263-5E08D5BC3673",
        title: "Qué Instrumentos de financiamiento existen para PyMEs",
        description: "Conoce los instrumentos de financiamiento para PyMEs: crédito bancario, capital de trabajo, adelantos en cuenta corriente, descuento de cheques, créditos para inversión, prefinanciar exportaciones y opciones del mercado de capitales.",
        date: "12/12/2025",
        readTime: "6 minutos de lectura",
        imageSrc: "/images/blogs/DBF81C9A-7CE1-4982-8263-5E08D5BC3673.png",
        flyerType: BlogFlyerType.General,
        sections: [
            {
                type: 'title',
                content: 'Opciones de financiamiento para Pymes: del crédito bancario al mercado de capitales'
            },
            {
                type: 'description',
                content: 'De los adelantos en cuenta corriente y financiamiento de capital de trabajo al descuento de documentos en el mercado de capitales. A la hora de buscar una línea de crédito, las pequeñas y medianas empresas cuentan con una lista de opciones a la que pueden recurrir en función de sus necesidades.'
            },
            {
                type: 'description',
                content: 'Según los últimos datos disponibles del Banco Central de la República Argentina (BCRA), la disponibilidad de crédito al sector privado viene creciendo, con una expansión más marcada en los primeros meses y una desaceleración en el segundo semestre, producto del aumento coyuntural de las tasas de interés.'
            },
            {
                type: 'description',
                content: 'Entre enero y agosto de 2025, el saldo del crédito a empresas y particulares acumuló un incremento del 56% en términos reales frente al mismo período del año anterior.'
            },
            {
                type: 'title',
                content: '¿Qué líneas de crédito bancario utilizan las pymes?'
            },
            {
                type: 'subtitle',
                content: 'Financiamiento de capital de trabajo'
            },
            {
                type: 'description',
                content: 'La línea más común que las entidades bancarias conceden a las pymes corresponde al financiamiento del capital de trabajo para cubrir los gastos operativos de la empresa (compra de insumos, pago de sueldos y servicios, por ejemplo).\n\n¿Cómo funciona el financiamiento del capital de trabajo? Es un préstamo al que puede acceder la compañía en función de su correspondiente evaluación de riesgo crediticia, para financiar su operatoria. La aprobación por parte de la entidad suele ser rápida. Tiene plazos de devolución promedio de 12 meses, que pueden extenderse hasta 24 meses.'
            },
            {
                type: 'subtitle',
                content: 'Adelantos en cuenta corriente'
            },
            {
                type: 'description',
                content: 'La segunda opción más usada por las pymes para financiarse son los adelantos en cuenta corriente, detrás del descuento de cheques, con el 35% del total del financiamiento que emplean, según estadísticas de este año de la asociación de bancos Abappra. Los adelantos en cuenta corriente, popularmente llamados descubiertos en cuenta corriente, están destinados a cubrir demandas de liquidez inmediata. Su tasa de interés suele ser más alta que la de los préstamos de capital de trabajo.'
            },
            {
                type: 'subtitle',
                content: 'Descuento de cheques'
            },
            {
                type: 'description',
                content: 'El descuento de cheques a cobrar o de terceros es el recurso más usado por las firmas para obtener liquidez inmediata antes de la fecha de cobro. Según los últimos números disponibles, representa un 46% del financiamiento que toman las pymes en el mercado bancario. Los cheques y otros documentos pueden ser descontados en entidades o en el mercado de capitales a través de las ALyC, las sociedades que actúan como intermediarias en el mercado de valores.'
            },
            {
                type: 'subtitle',
                content: 'Créditos para inversión: equipos, maquinaria y ampliaciones'
            },
            {
                type: 'description',
                content: 'Es el otro tipo de crédito que pueden obtener las pymes. Se utiliza para comprar maquinaria, ampliar instalaciones o modernizar equipos, por ejemplo. Algunas de estas líneas se canalizan a través de esquemas como el leasing, que funciona como un alquiler con opción de compra al finalizar el contrato y cuenta con beneficios impositivos. Sus plazos de devolución son más largos, así como el proceso de aprobación por parte de la entidad bancaria.'
            },
            {
                type: 'subtitle',
                content: 'Créditos para financiar operaciones de comercio exterior'
            },
            {
                type: 'description',
                content: 'Son líneas en dólares que permiten a las empresas financiar sus operaciones de comercio exterior (exportaciones e importaciones). Prefinanciación de exportaciones y cartas de crédito de importaciones, entre ellas.'
            },
            {
                type: 'title',
                content: '¿Qué alternativas ofrece el mercado de capitales para las pymes?'
            },
            {
                type: 'subtitle',
                content: 'Cheque de pago diferido y pagaré bursátil'
            },
            {
                type: 'description',
                content: 'Permiten obtener un adelanto de fondos mediante su venta en el mercado a cambio de una tasa de descuento. Según estadísticas de la Comisión Nacional de Valores (CNV) correspondientes a agosto de este año (últimas disponibles), el pagaré bursátil representó el 52% del financiamiento obtenido por las pymes. Es un instrumento que admite plazos más largos que otros, como los cheques de pago diferido, tanto de terceros como propios.\n\nAl respecto, los cheques avalados por una Sociedad de Garantía Recíproca (SGR) representaron el 14% del financiamiento obtenido por las pymes, y los cheques de pago diferido directos, el 8%.'
            },
            {
                type: 'subtitle',
                content: 'Factura de crédito electrónica'
            },
            {
                type: 'description',
                content: 'Desde su creación, se convirtió en otra herramienta clave para las pymes. Permite negociar las facturas emitidas a grandes empresas, obteniendo fondos antes del vencimiento y mejorando el flujo de caja. Las facturas de crédito electrónicas representaron el 8% del monto obtenido por las pymes en agosto de este año. El descuento de facturas puede ser negociado no solo en el mercado de capitales sino también a través de plataformas que ofrecen este tipo de instrumentos a las entidades financieras.'
            },
            {
                type: 'subtitle',
                content: 'ON PyME y fideicomisos financieros'
            },
            {
                type: 'description',
                content: 'El mercado de valores ofrece además alternativas más sofisticadas, como:\n\n<strong>Obligaciones Negociables (ON) Simple para pymes</strong>: son emisiones de deuda privada que las firmas pueden realizar para captar fondos de los inversores. Pagan una tasa de interés semestral o anual además de devolver el capital en un plazo determinado. Deben estar avaladas por una SGR, lo que mejora sus condiciones de emisión.\n\n<strong>Fideicomisos Financieros (FF)</strong>: permiten estructurar operaciones más complejas, agrupando activos o flujos futuros para obtener financiamiento bajo una figura legal específica.'
            }
        ]
    },
    {
        id: "9473EAF1-7333-4086-83E3-B7F1582022F1",
        title: "Cómo pedir un crédito PyME y qué requisitos se necesitan: todo lo que hay que saber",
        description: "Qué necesita una PyME para pedir un crédito: certificado MiPyME, balances, avales y opciones de financiamiento y plazos. Descubre los tipos de créditos, documentación y claves para acceder al crédito más conveniente.",
        date: "12/12/2025",
        readTime: "6 minutos de lectura",
        imageSrc: "/images/blogs/9473EAF1-7333-4086-83E3-B7F1582022F1.png",
        flyerType: BlogFlyerType.General,
        sections: [
            {
                type: 'title',
                content: '¿Qué necesita una PyME para pedir un crédito?'
            },
            {
                type: 'description',
                content: 'En todos los contextos, el financiamiento es esencial para el normal funcionamiento para los proyectos de crecimiento de las empresas. Si una pyme necesita pedir un crédito en una entidad financiera, vale tener presente qué tipo de requisitos le exigirán, cuáles son las opciones disponibles en función de la necesidad y qué pasos tendrá que dar.'
            },
            {
                type: 'description',
                content: 'En lo que va del año 2025, según los datos oficiales del Banco Central de la República Argentina (BCRA), la disponibilidad de crédito al sector privado viene creciendo, con una expansión más marcada en los primeros meses y una desaceleración en el segundo semestre, producto del aumento coyuntural de las tasas de interés. Entre enero y agosto (últimos datos disponibles), el saldo del crédito a empresas y particulares acumuló un incremento del 56% en términos reales frente al mismo período del año anterior.'
            },
            {
                type: 'title',
                content: '¿Cuánto representa el crédito pyme dentro de la oferta de los bancos?'
            },
            {
                type: 'description',
                content: 'Según un análisis de Abappra, la asociación de bancos públicos y privados de la Argentina, el crédito para ese tipo de empresas cerraría este año en 2% del Producto Bruto Interno (PBI). En los primeros cinco meses del año, el crédito en pesos para el segmento pyme aumentó 3,7%. Se calcula que alrededor del 50% del total disponible del financiamiento al sector privado corresponde a líneas para pequeñas y medianas empresas.'
            },
            {
                type: 'title',
                content: '¿Qué tipos de créditos pueden sacar las pymes?'
            },
            {
                type: 'subtitle',
                content: 'Financiamiento de capital de trabajo'
            },
            {
                type: 'description',
                content: 'El financiamiento de capital de trabajo es la línea más usual a la que recurre una pyme en momentos de estabilidad financiera para cubrir el día a día de su operación (pago de salarios, compra de insumos, entre otros). Se trata de un préstamo que suele tener un plazo promedio de 12 meses (puede llegar hasta dos años o más en algunos casos), para financiamiento operativo. Son de otorgamiento relativamente rápido.'
            },
            {
                type: 'description',
                content: 'Para cubrir necesidades puntuales de liquidez, una de las opciones más usadas por las pymes son los adelantos en cuenta corriente.'
            },
            {
                type: 'subtitle',
                content: 'Préstamos de inversión productiva'
            },
            {
                type: 'description',
                content: 'Los préstamos para la inversión son líneas específicas que otorgan las entidades para la compra de maquinaria, vehículos, ampliación de una planta y otros fines. Tienen plazos de hasta 10 años con períodos de gracia de hasta 12 meses. Algunas de estas líneas son canalizadas a través del leasing, la variante que funciona como una cuota de alquiler y en la que el tomador del crédito tiene la opción de adquirir el bien al final del crédito. Los tiempos de aprobación para el otorgamiento demoran más que en el caso de capital de trabajo.'
            },
            {
                type: 'subtitle',
                content: 'Descuento de documentos'
            },
            {
                type: 'description',
                content: 'Las pymes pueden vender sus cheques a cobrar o sus facturas de crédito a cambio de un descuento en el monto a percibir, para contar con un adelanto de los fondos. Es la forma más rápida de acceder a financiamiento. Los descuentos de documentos representan el tipo de crédito más usado por las pymes, con un 46% del total, según los bancos agrupados en Abappra. Luego vienen los adelantos en cuenta corriente, con el 35%, y los préstamos a sola firma, con el 19%.'
            },
            {
                type: 'subtitle',
                content: 'Crédito PyME en el mercado de capitales'
            },
            {
                type: 'description',
                content: 'Una pyme también puede recurrir al mercado de capitales para negociar cheques de pago diferido, pagarés o facturas de crédito electrónicas y captar un adelanto de fondos. La venta de pagarés es la opción más utilizada, con un 65% del total de recursos captados en los primeros ocho meses del año, según la CNV.'
            },
            {
                type: 'title',
                content: '¿Qué se necesita para pedir un crédito PyME?'
            },
            {
                type: 'description',
                content: 'Para acceder a adelantos en cuenta corriente y capital de trabajo, el banco le solicitará a la empresa, como regla general, su certificado MiPyME (que lo otorga la subsecretaría PyME y se gestiona con CUIT y clave fiscal en el sitio de ARCA) y una antigüedad de al menos un año en su inscripción fiscal. Existen líneas específicas para microempresas de montos menores que piden una antigüedad menor al año y no requieren el certificado MiPyME.'
            },
            {
                type: 'subtitle',
                content: 'Documentación requerida'
            },
            {
                type: 'description',
                content: 'La empresa tendrá que presentar sus últimos balances, las ventas post balance, el estatuto y las actas de designación de autoridades para mostrar su situación financiera y societaria. Si la pyme cuenta con su Legajo Único Financiero y Económico (LUFE), es posible que no le requieran balances. Para un crédito mayor a 12 meses, el banco exigirá una proyección del flujo de fondos y una descripción abarcativa de la actividad de la firma (clientes, proveedores, detalles del negocio). Si el préstamo cuenta con un bien como garantía, se exigirá el título de propiedad. Si requiere una fianza de socios, se les pedirá la manifestación de bienes.'
            },
            {
                type: 'description',
                content: 'En la evaluación que efectuará el banco para otorgar el préstamo entrará en juego el historial de la firma en el sistema financiero y su posición deudora. La denominada Situación 1, que implica atrasos en pagos de hasta un mes, es la ideal para obtener un crédito con mayor facilidad.'
            },
            {
                type: 'title',
                content: 'Claves para conseguir el crédito más conveniente'
            },
            {
                type: 'list',
                content: [
                    'Tener la documentación al día',
                    'Respaldar el pedido con proyecciones de ventas.',
                    'Comparar tasas y condiciones mediante plataformas como LUC.',
                    'Considerar el descuento de documentos en el mercado de capitales.',
                    'Explorar líneas de crédito subsidiadas.',
                    'Recurrir a una SGR o fondo de garantía estatal para gestionar un aval.',
                    'No tener cheques rechazados informados en la central de riesgo del Banco Central (BCRA) y mantener la situación 1 en la central de deudores de la autoridad monetaria.'
                ]
            }
        ]
    },
    {
        id: "3282E61C-7FC1-46EF-A940-2EC2BD51976F",
        title: "Scoring crediticio pyme gratis: cómo acceder online a la información de la empresa que existe en el mercado",
        description: "En el proceso de buscar financiamiento, todas las empresas e individuos son sometidos a un análisis de su historia crediticia y de su situación actual como clientes del sistema financiero. ¿De dónde salen esos indicadores? ¿Cuánto pesan en la decisión del que otorga el préstamo?",
        date: "30/12/2025",
        readTime: "4 minutos de lectura",
        imageSrc: "/images/blogs/3282E61C-7FC1-46EF-A940-2EC2BD51976F.png",
        flyerType: BlogFlyerType.Bureau,
        sections: [
            {
                type: 'description',
                content: 'Muchas pymes pueden no conocer esta información, o no tener en claro cuáles son sus características. Como consecuencia, una reacción posible es no explorar las oportunidades de acceder a fondos que ofrece el mercado, por temor a no poder cumplir con aquellos requisitos que les suenan difíciles de comprender.' + '\n' +
                    'Hay una forma de destrabar esa percepción para que más pymes puedan potenciar sus proyectos con los recursos que brinda el sistema financiero. La plataforma LUC cuenta con una opción dentro de sus funcionalidades denominada “Ver cómo me ven”: ahí, una empresa que se haya registrado en el sitio puede acceder a toda la información que existe en el mercado a través de bases de datos públicas y de bureaus de crédito. Esto es, conocer la información abierta que sus propios clientes, proveedores y entidades financieras pueden estar consultando en ese mismo momento sobre ella, sin que la empresa lo sepa o sea plenamente consciente de ello.'
            },
            {
                type: 'title',
                content: 'Cuál es la información que se conoce sobre una PyME'
            },
            {
                type: 'description',
                content: 'La función <strong>Ver cómo me ven</strong> de LUC muestra:'
            },
            {
                type: 'list',
                content: [
                    'La información fiscal de la firma, con los impuestos en los que se haya.',
                    'Los créditos que posee en el sistema financiero, con todos sus detalles (no solo la información que proveen los bancos, sino todas las entidades que proveen crédito, aunque no sean financieras, como empresas que financian la compra de artículos de consumo).',
                    'Si cuenta o no con cheques rechazados.',
                    'La situación de sus aportes previsionales.',
                    'Un score crediticio de uno de los burós más utilizados, un plus que brinda la plataforma para sus miembros.'
                ]
            },
            {
                type: 'title',
                content: 'Por qué es importante para una pyme conocer la información que existe en el mercado'
            },
            {
                type: 'description',
                content: 'Saber cuáles son los datos públicos sobre la empresa que están disponibles para las entidades financieras antes de encarar una solicitud de crédito le permite anticiparse a los requerimientos y corregir lo que sea necesario (por ejemplo, resolver algún caso eventual de cheques rechazados que figure en los informes). En el mismo sentido, contar con esa información le da a una pyme la posibilidad de solicitar mejores propuestas de financiamiento y compararlas, para avanzar con la más conveniente en cada ocasión.' + '\n' +
                    'Vale reiterar que se trata de información disponible en bases oficiales a las que bancos y entidades financieras pueden acceder, como la que elabora el Banco Central sobre la posición deudora (Central de Deudores) y el cumplimiento de cheques (Central de Cheques Rechazados).' + '\n' +
                    'Como suele decirse, la información es poder y, en este caso, funciona como un activo que la empresa puede utilizar a su favor. Al conocer de antemano cuál es su imagen en el sistema financiero, puede encarar las gestiones para obtener financiamiento desde una posición de mayor fortaleza, sin esperar sorpresas.'
            },
        ]
    },
    {
        id: "16AF8914-192C-46CF-A8C0-A9AA76EA1978",
        title: "Qué debe tener en cuenta una Pyme antes de pedir un crédito",
        description: "El proceso de obtener una línea de crédito para una pequeña y mediana empresa puede sonar a priori más complejo de lo que es. Se sabe que, por razones históricas, muchos emprendedores y empresarios pyme apelan al capital propio para financiar sus proyectos, pero ese recurso es limitado en comparación con el volumen con el que cuenta el mercado financiero.",
        date: "29/12/2025",
        readTime: "5 minutos de lectura",
        imageSrc: "/images/blogs/16AF8914-192C-46CF-A8C0-A9AA76EA1978.png",
        flyerType: BlogFlyerType.General,
        sections: [
            {
                type: 'description',
                content: 'Es decir: para impulsar un verdadero crecimiento es importante que las pymes puedan acceder a todas las oportunidades de financiamiento existentes.'
            },
            {
                type: 'description',
                content: 'En esa línea, ¿qué conviene tener en cuenta antes de buscar financiamiento —crédito bancario, descuento de documentos, facturas ON PyME— desde la perspectiva de un empresario pyme? A continuación, compartimos una guía con los principales puntos a considerar'
            },
            {
                type: 'title',
                content: '1. Definir con claridad para qué destinará el crédito'
            },
            {
                type: 'description',
                content: 'Distinguir el uso que le dará la pyme al capital es el paso número uno. La principal diferenciación radica en si la empresa necesita financiar su operación diaria o si está pensando en un proyecto de inversión de más largo plazo. Ahí, si lo que se busca son fondos de plazos no mayores a los 12 meses en promedio, la opción tradicional son los créditos para capital de trabajo. Para obtener liquidez inmediata, junto con los descubiertos en cuenta corriente se destacan el descuento de cheques y de facturas.'
            },
            {
                type: 'description',
                content: 'Para proyectos de inversión con plazos más allá de los dos años, la alternativa más común son los préstamos de financiación productiva, que pueden ofrecer un período de gracia antes de comenzar con el repago. El leasing es otra alternativa. Hay que tener presente que las tasas de interés y las condiciones de cada instrumento (capital de trabajo o préstamos de inversión) son diferentes, lo mismo que los plazos de aprobación.'
            },
            {
                type: 'description',
                content: 'Otra opción más sofisticada para financiar proyectos de largo plazo es la emisión de una Obligación Negociable (ON) Pyme en el mercado de capitales. En ese caso, debe contar con el aval de una Sociedad de Garantía Recíproca (SGR).'
            },
            {
                type: 'title',
                content: '2. Tener lista la documentación que le exigirán bancos y financieras para no perder tiempo'
            },
            {
                type: 'description',
                content: 'Antes de buscar financiamiento, una pyme necesita conocer con precisión la información que le solicitarán para ser sujeto de crédito. Vale repasar entonces que la empresa requerirá:'
            },
            {
                type: 'list',
                content: [
                    'Su certificado MiPyME (es gratuito, se tramita en la web de la secretaría PyME y hay que renovarlo todos los años).',
                    'Estatuto',
                    'Certificados MiPyME',
                    'Últimos Balances',
                    'Ventas Post Balance',
                    'Una proyección del flujo de fondos y una descripción de su actividad'
                ]
            },
            {
                type: 'description',
                content: 'Estos requisitos pueden variar según el tipo de instrumento (ya que no todos exigen la lista completa). Para determinar la posibilidad, el monto, la tasa y el plazo que podrían otorgarse a la empresa, las entidades realizan una evaluación de riesgo crediticio. En ese proceso analizan la información presentada, el historial de la firma en el sistema financiero, su situación ante el Banco Central y ARCA, y el scoring de los burós de crédito como un indicador adicional.'
            },
            {
                type: 'description',
                content: 'Allí cobra relevancia la posición deudora de la compañía. La situación 1 ante el Banco Central —que implica atrasos en pagos de hasta un mes— es la ideal para acceder a un crédito de manera más ágil. La autoridad monetaria califica a los deudores del 1 al 5 en función del cumplimiento de sus obligaciones y también cuenta con la Central de Cheques Rechazados (no figurar en ese listado también mejora la posición de la firma).'
            },
            {
                type: 'title',
                content: '3. Saber cuáles son los indicadores financieros que analizan las entidades'
            },
            {
                type: 'description',
                content: 'Para conocer la salud financiera de la pyme y definir su capacidad de pago (sea para instrumentos de corto o largo plazo), bancos y financieras miran una serie de indicadores del negocio de la compañía. Entre ellos, su ratio de endeudamiento, flujo de caja, liquidez, Ebitda y los márgenes bruto y neto. También pueden solicitar, eventualmente, el promedio de ventas y proyecciones del flujo de fondos futuros. Para la evaluación, cada entidad toma diferentes indicadores y pondera los antecedentes de la firma según su criterio. '
            },
            {
                type: 'description',
                content: 'Tener los números en orden con la mayor cantidad de información posible que refleje la posición actual de la firma es un paso previo importante para acceder al crédito.'
            },
            {
                type: 'title',
                content: '4. Considerar las opciones que mejoran las condiciones de acceso al financiamiento'
            },
            {
                type: 'description',
                content: 'En este punto, una pyme necesita tener presente que gestionar un aval de una SGR o de un fondo de garantía estatal es un instrumento clave que permite conseguir mejores condiciones de tasas y plazos para el financiamiento solicitado, ya que la SGR o el fondo responden en caso de un incumplimiento por parte de la empresa. Contar con un aval se transforma así en una herramienta que puede agilizar el otorgamiento crediticio al reforzar la posición de la empresa. Los avales son relevantes no solo para el crédito bancario, sino también para los instrumentos del mercado de capitales (como una ON PyME).'
            },
            {
                type: 'title',
                content: '5. Comparar la oferta disponible y estar abierto a las oportunidades'
            },
            {
                type: 'description',
                content: 'No quedarse con una única opción es otro de los sanos consejos que puede seguir un empresario pyme al momento de buscar recursos financieros. En un tiempo donde la digitalización cambió las reglas de todos los mercados, comparar qué ofrecen las distintas entidades y cuáles son los requisitos que piden para otorgar financiamiento es una ventaja que hay que aprovechar. Plataformas como LUC, que concentra y permite comparar distintas líneas de crédito e instrumentos, tienen mucho para ofrecer en ese sentido, no solo para visibilizar las diferentes opciones existentes, sino también para facilitar la gestión de la solicitud de las diferentes líneas de manera online.'
            }
        ]
    }
]
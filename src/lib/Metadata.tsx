export default function Metadata() {
    const metadata = {
        description: 'Optimize your study workflow. Orchard makes studying tailored & efficient with regenerating practice questions. It regenerates questions by randomising the values so you can practice specific skills as much as you need.',
        keywords: 'Math, IB, DSE, AP, IGCSE, A-Levels, Practice, Questions, Physics, Chemistry'
    }
    return (
        <>
            <meta name='description' content={metadata.description}/>
            <meta name='keywords' content={metadata.keywords}/>
        </>
    )
}
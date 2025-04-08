export default function Metadata() {
    const metadata = {
        description: 'Optimize your study workflow. Orchard makes studying tailored & efficient with smart practice questions. Generate extra questions from your practice resources, to optimise your practice to perfection.',
        keywords: 'Math, IB, DSE, AP, IGCSE, A-Levels, Practice, Questions, Physics, Chemistry'
    }
    return (
        <>
            <meta name='description' content={metadata.description}/>
            <meta name='keywords' content={metadata.keywords}/>
        </>
    )
}
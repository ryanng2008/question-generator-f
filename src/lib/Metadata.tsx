export default function Metadata() {
    const metadata = {
        description: 'By Ryan & Athan',
        keywords: 'Math, IB, DSE, AP, IGCSE, A-Levels, Practice, Questions, Physics, Chemistry'
    }
    return (
        <>
            <meta name='description' content={metadata.description}/>
            <meta name='keywords' content={metadata.keywords}/>
        </>
    )
}
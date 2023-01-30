export interface Document {
    filename: string, 
    tsne_0: number,
    tsne_1: number,
    author: string,
    department: string,
    issued: string,
    uri: string, 
    oclc: string | null,
    abstract: string | null,
    subject: string | null, 
    title: string,
    image_url: string, 
    handle: string,
    identifier: string,
    main_topic: number,
    x: number,
    y: number
}
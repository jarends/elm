module elm
{
    export interface VO
    {
        uid:string;
        clazz:string;
        name:string;
        parent:VO;
        children:VO[];
    }
}

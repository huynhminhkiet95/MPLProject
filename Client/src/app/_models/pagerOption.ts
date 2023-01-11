export class PagerOption
{
    pageSize:number;
    pageIndex:number;
    indexFocus:number;
    constructor()
    {
        this.pageSize = 10;
        this.pageIndex = 0;
    }
    extract(grid:any)
    {
        this.pageIndex = grid.instance["_options"].paging.pageIndex
        this.pageSize =  grid.instance["_options"].paging.pageSize
    }
}
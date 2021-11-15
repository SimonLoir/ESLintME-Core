import Rule from '../Rule';

export default class BraceStyleRule extends Rule<any> {
    public static esname = 'brace-style';
    public extract() {
        return null;
    }
    public static normalize(data: any) {
        return data;
    }
}

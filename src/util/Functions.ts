class Functions {
    public static isNumber(value?: string | number): boolean {
        return ((value != null) && (value !== '') && !isNaN(Number(value.toString())));
    }
}

export default Functions
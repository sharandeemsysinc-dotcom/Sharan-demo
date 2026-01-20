// Format date to yyyy-mm-dd format
export const reverseFormat = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Format date to mon-dd-yyyy format
export const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const month = date.toLocaleString("en-US", { month: "short" }); // Dec
    const day = String(date.getDate()).padStart(2, "0");           // 22
    const year = String(date.getFullYear()).slice(-2);             // 25

    const formattedDate = month + " " + day + ", " + year;

    return `${formattedDate}`;
};
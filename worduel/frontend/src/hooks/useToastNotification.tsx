import { toast } from "react-toastify";

const useToast = () => {
    const showToast = (message: string, type: "info" | "success" | "error") => {
        const className = `${type === 'info' ? 'bg-primary' : type === 'success' ? 'bg-green-500' : 'bg-secondary'}`;
        const options = {
            autoClose: 1500,
            className,
            bodyClassName: `text-background ${className}`,
            closeButton: false,
        };

        const formattedMessage = <p className={`text-background ${className}`}>{message}</p>;

        toast(formattedMessage, options);
    };

    return { showToast };
};

export default useToast;

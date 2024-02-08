const Line = (props) => {
    return (
        <hr
            id={props.id.substring(props.id.startsWith('#'))}
            className="line"
        />
    );
};

export default Line;
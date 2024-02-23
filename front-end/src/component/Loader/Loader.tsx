import "./Loader.css"

function Loader() {
    return (
        <div className="overlay-container">
            <div data-testid="loading_spinner" className="spinner"></div>
        </div>
    )
}

export default Loader
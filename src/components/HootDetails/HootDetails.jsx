import { useParams } from "react-router";
import { useState, useEffect, useContext } from "react";
import * as hootService from '../../services/hootService';
import CommentForm from "../CommentForm/CommentForm";
import { UserContext } from "../../contexts/UserContext";

const HootDetails = (props) => {
    const { hootId } = useParams();
    const {user} = useContext(UserContext);
    const [hoot, setHoot] = useState(null);

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

    // console.log('hoot', hoot);

    const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(hootId, commentFormData);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
    };

    if (!hoot) return <main>Loading...</main>;

    return (
        <main>
            <section>
                <header>
                    <p>{hoot.category.toUpperCase()}</p>
                    <h1>{hoot.title}</h1>
                    <p>
                        {`${hoot.author.username} posted on ${new Date(hoot.createdAt).toLocaleDateString()}`}
                    </p>
                    {hoot.author._id === user._id && (
                        <>
                            <button onClick={() => props.handleDeleteHoot(hootId)}>DELETE</button>
                        </>
                    )}
                </header>
                <p>{hoot.text}</p>
            </section>
            <section>
                <h2>Comments</h2>
                <CommentForm handleAddComment={handleAddComment}></CommentForm>

                {!hoot.comments.length && <p>[no comments]</p>}

                {hoot.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <p>
                                {`${comment.author.username} posted on ${new Date(comment.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
        </main>
    );

};

export default HootDetails;
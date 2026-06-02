import { Router } from 'express'
import footer from './footer.js';

const router = Router()

router.get('/', async (req, res, next) => {

    res.render('about', {
        footer: await footer()
    });
    //res.send(`Taxonomy route is working for ${filterType} with slug: ${slug}`);
})

export default router;
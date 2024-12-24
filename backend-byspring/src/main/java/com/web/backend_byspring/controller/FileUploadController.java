package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.FileRespones;
import com.web.backend_byspring.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/upload")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @Value("${project.upload}")
    private String path;

    @GetMapping("/{fileName}")
    public ResponseEntity<ByteArrayResource> getFileName(@PathVariable String fileName) {
        if (fileName != null && !fileName.isEmpty()) {
            byte[] buffer = fileUploadService.getFileName(fileName);
            if (buffer != null) {
                ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
                final MediaType image_PNG2 = MediaType.IMAGE_PNG;
                if (image_PNG2 != null) {
                    return ResponseEntity.ok().contentLength(buffer.length).contentType(image_PNG2)
                            .body(byteArrayResource);
                } else {
                    return null;
                }
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping(value = "/single", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileRespones uploadSingle(@RequestPart MultipartFile file) {
        return fileUploadService.uploadSingle(file, path);
    }

    @PostMapping(value = "/multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<FileRespones> uploadMultiple(@RequestPart List<MultipartFile> files) {
        return fileUploadService.uploadMultiple(files, path);
    }
}

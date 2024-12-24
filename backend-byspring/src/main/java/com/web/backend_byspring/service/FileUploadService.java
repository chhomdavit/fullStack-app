package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.FileRespones;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileUploadService {

    byte[] getFileName(String fileName);

    List<FileRespones> findAll();

    String saveBase64Image(String path, byte[] base64Image);

    FileRespones uploadSingle(MultipartFile file, String path);

    List<FileRespones> uploadMultiple(List<MultipartFile> files, String path);

    void deleteAll();

    void deleteByName(String fileName);

    Resource downloadByName(String fileName);
}
